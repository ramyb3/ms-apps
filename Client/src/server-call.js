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

      if (sort) {
        resp = await axios.post(
          `http://localhost:8000/${CATEGORY}+${sort.toLowerCase()}`
        );
      } else {
        resp = await axios.post(`http://localhost:8000/${CATEGORY}`);
      }

      dispatch({ type: "LOAD", payload: resp.data });
    } catch (e) {
      console.error(e);
      return [];
    }
  };
}
