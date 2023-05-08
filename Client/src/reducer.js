export default function reducer(state = {}, action) {
  switch (action.type) {
    case "LOAD": {
      return action.payload;
    }

    default:
      return state;
  }
}
