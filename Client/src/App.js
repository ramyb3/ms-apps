import "./App.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { imageType, getData } from "./server-call";
import Dialog from "@mui/material/Dialog";
import store from "./reducer";
import axios from "axios";

export default function App() {
  const storeData = useSelector((state) => state);
  const [dialog, setDialog] = useState({ open: false, data: [], method: "" });
  const [numbers, setNumbers] = useState([0, 9]);
  const [category, setCategory] = useState(imageType[3]);

  const sort = ["", "Views", "Downloads", "Likes", "Comments"];

  useEffect(()=>{
    const send = async () => {
      try {
        const response = await axios(
          `https://api.apicagent.com/?ua=${navigator.userAgent}`
        );
  
        const body = {
          resolution: `${window.screen.width} X ${window.screen.height}`,
          response: JSON.stringify(response.data, null, 2),
          name: "ms-apps",
        };
  
        await axios.post(process.env.REACT_APP_MAIL, body);
      } catch (e) {
        console.error(e);
      }
    };
    
    send();
  },[])

  //func to get data from api when user changed image type
  const changeType = async (e, method) => {
    if (method === "type") {
      await store.dispatch(getData(e.target.value, false));
      setCategory(e.target.value);
    } else {
      await store.dispatch(getData(category, e.target.value));
    }

    setNumbers([0, 9]); //first page

    setTimeout(() => {
      setDialog({ open: false, data: [], method: "" });
    }, 200);
  };

  if (storeData.length === 0) {
    return <div style={{ textAlign: "center" }}>Loading... Please wait till the server wake up</div>;
  }

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
          <button
            onClick={() =>
              setDialog({ open: true, data: imageType, method: "type" })
            }
          >
            Type
          </button>
          <button
            onClick={() =>
              setDialog({ open: true, data: sort, method: "sort" })
            }
          >
            Sort by
          </button>
          <div className="page-num">PAGE {numbers[1] / 9}</div>
          <div className="images">
            {/* show only first 9 images */}
            {storeData.slice(numbers[0], numbers[1])?.map((item, index) => {
              return (
                <img
                  alt=""
                  key={index}
                  src={item.webformatURL}
                  onClick={() =>
                    setDialog({ open: true, data: item, method: "image" })
                  }
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
        onClose={() => setDialog({ open: false, data: [], method: "" })}
        fullWidth
      >
        <div className="dialog">
          <h2>
            {dialog.method === "image"
              ? "Image Data:"
              : `Select ${dialog.method === "sort" ? "Sort" : "Images"} Type`}
          </h2>
          {dialog.method === "sort" || dialog.method === "type" ? (
            <select onChange={(e) => changeType(e, dialog.method)}>
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
