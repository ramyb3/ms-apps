const express = require("express");
const router = express.Router();

const data = require("../models/data");

router.get("/", function (req, res, next) {
  return res.json("");
});

router.post("/:id", async function (req, res, next) {
  return res.json(await data.getData(req.params.id));
});

module.exports = router;
