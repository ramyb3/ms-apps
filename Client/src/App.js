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

  useEffect(() => {
    getData(imageType[3]);
  }, []);

  const getData = async (type) => {
    try {
      const resp = await axios.post(`http://localhost:8000/${type}`);

      dispatch({ type: "LOAD", payload: resp.data.hits });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const changeType = async (e) => {
    await getData(e.target.value);

    setNumbers([0, 9]);

    setTimeout(() => {
      setDialog({ open: false, data: [] });
    }, 200);
  };

  return (
    <>
      <div className="layout">
        <button
          onClick={() => {
            if (numbers[0] > 0) {
              setNumbers([numbers[0] - 9, numbers[1] - 9]);
            }
          }}
        >
          prev
        </button>

        <div className="center-column">
          <button onClick={() => setDialog({ open: true, data: imageType })}>
            choose type
          </button>
          <div className="images">
            {storeData.length > 0
              ? storeData.slice(numbers[0], numbers[1]).map((item, index) => {
                  return (
                    <img
                      alt=""
                      key={index}
                      src={item.webformatURL}
                      onClick={() => setDialog({ open: true, data: item })}
                    />
                  );
                })
              : null}
          </div>
        </div>

        <button onClick={() => setNumbers([numbers[0] + 9, numbers[1] + 9])}>
          next
        </button>
      </div>

      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, data: [] })}
        fullWidth
      >
        <div className="dialog">
          <h2>
            {Array.isArray(dialog.data) ? "Select Images Type" : "Image Data:"}
          </h2>
          {Array.isArray(dialog.data) ? (
            <select onChange={changeType}>
              {dialog.data.map((item, index) => {
                return <option key={index}>{item}</option>;
              })}
            </select>
          ) : (
            <div>
              {Object.keys(dialog.data).map((item, index) => {
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
              })}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
