const express = require("express");
const router = express.Router();

const data = require("../models/data");

router.get("/", function (req, res, next) {
  return res.json("");
});

router.post("/:id", async function (req, res, next) {
  if (req.params.id.includes("+")) {
    const params = req.params.id.split("+");
    const response = await data.getData(params[0]);

    response.sort((a, b) => {
      const x = b[params[1]];
      const y = a[params[1]];
      return x < y ? -1 : x > y ? 1 : 0;
    });

    return res.json(response);
  } else {
    return res.json(await data.getData(req.params.id));
  }
});

module.exports = router;
