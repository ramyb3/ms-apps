import axios from "axios";

export default function reducer(state = [], action) {
  switch (action.type) {
    case "LOAD": {
      return action.payload;
    }
    default:
      return state;
  }
}

export const imageType = ["", "Animals", "Sport", "Work", "Flowers"];

export function getData(CATEGORY, sort) {
  return async function fetchData(dispatch, getState) {
    try {
      let resp;
      // REACT_APP_API_SERVER= http://localhost:8000

      if (sort) {
        resp = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/${CATEGORY}+${sort.toLowerCase()}`
        );
      } else {
        resp = await axios.post(`${process.env.REACT_APP_API_SERVER}/${CATEGORY}`);
      }

      dispatch({ type: "LOAD", payload: resp.data });
    } catch (e) {
      console.error(e);
      return [];
    }
  };
}
