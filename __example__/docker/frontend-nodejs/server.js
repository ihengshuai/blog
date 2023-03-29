const express = require("express");
const app = express();
const dayjs = require("dayjs");

app.use((req, res) => {
  console.log("【request】：" + req.url);
  res.json({
    code: 200,
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    path: req.url,
    query: {
      ...req.query,
    },
  });
});

app.listen(10001, () => console.log("server is running on port 10001."));
