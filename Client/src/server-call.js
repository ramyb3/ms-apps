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

export function getData(CATEGORY) {
  return async function fetchData(dispatch, getState) {
    try {
      const resp = await axios.post(`http://localhost:8000/${CATEGORY}`);

      dispatch({ type: "LOAD", payload: resp.data.hits });
    } catch (e) {
      console.error(e);
      return [];
    }
  };
}
