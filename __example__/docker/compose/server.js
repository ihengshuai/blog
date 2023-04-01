const express = require("express");

const app = express();

// 没有使用nginx代理跨域时，可以配置nodejs跨域
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PATCH, PUT, DELETE"
//   );
//   res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
//   next();
// });

app.use((req, res) => {
  console.log(req.url);
  res.json({
    code: 200,
    date: +new Date(),
  });
});

app.listen(10010, () => console.log("server is runnning on port 10010"));
