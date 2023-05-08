const axios = require("axios");

exports.getData = async function (type) {
  try {
    //I added per_page=200 because the default is 20
    const resp = await axios.get(
      `https://pixabay.com/api/?key=25540812-faf2b76d586c1787d2dd02736&q=${type}&per_page=200`
    );
    return resp.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
