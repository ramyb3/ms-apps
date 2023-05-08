import "./App.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

export default function App() {
  const storeData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState({ open: false, data: [] });
  const [numbers, setNumbers] = useState([0, 9]);

  const imageType = ["", "Animals", "Sport", "Work", "Flowers"];

  //only when app start
  useEffect(() => {
    getData(imageType[3]);
  }, []);

  //func to get data from api
  const getData = async (type) => {
    try {
      const resp = await axios.post(`http://localhost:8000/${type}`);

      dispatch({ type: "LOAD", payload: resp.data.hits });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  //func to get data from api when user changed image type
  const changeType = async (e) => {
    await getData(e.target.value);

    setNumbers([0, 9]);

    setTimeout(() => {
      setDialog({ open: false, data: [] });
    }, 200);
  };

  if (storeData.length > 0) {
    return (
      <>
        <div className="layout">
          <button
            onClick={() => {
              //check if the array in starting position
              if (numbers[0] > 0) {
                setNumbers(numbers.map((num) => num - 9));
              }
            }}
          >
            Prev
          </button>

          <div className="center-column">
            <button onClick={() => setDialog({ open: true, data: imageType })}>
              Type
            </button>
            <div className="images">
              {storeData?.slice(numbers[0], numbers[1])?.map((item, index) => {
                return (
                  <img
                    alt=""
                    key={index}
                    src={item.webformatURL}
                    onClick={() => setDialog({ open: true, data: item })}
                  />
                );
              })}
            </div>
          </div>

          <button onClick={() => setNumbers(numbers.map((num) => num + 9))}>
            Next
          </button>
        </div>

        <Dialog
          open={dialog.open}
          onClose={() => setDialog({ open: false, data: [] })}
          fullWidth
        >
          <div className="dialog">
            <h2>
              {Array.isArray(dialog.data)
                ? "Select Images Type"
                : "Image Data:"}
            </h2>
            {Array.isArray(dialog.data) ? (
              <select onChange={changeType}>
                {dialog.data.map((item, index) => {
                  return <option key={index}>{item}</option>;
                })}
              </select>
            ) : (
              Object.keys(dialog.data).map((item, index) => {
                //show only "raw data" & without sites
                if (
                  String(dialog.data[item]).includes("http") ||
                  String(dialog.data[item]) === ""
                ) {
                  return null;
                }

                return (
                  <div key={index} className="image-data">
                    <div style={{ fontWeight: "bold" }}>{item}:</div>
                    {dialog.data[item]}
                  </div>
                );
              })
            )}
          </div>
        </Dialog>
      </>
    );
  }
}
