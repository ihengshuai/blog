// #!env/node
const fs = require("fs")

// fs.readFile(__dirname + "/inherit.js", 'utf8', (err, data) => {
//   setTimeout(() => console.log("setTimout"));
//   setImmediate(() => console.log("setImmediate"));
// })

// setTimeout(() => {
//   console.log("setTimeout1");
//   Promise.resolve().then(() => console.log("promise1"));
// });
// setTimeout(() => {
//   console.log("setTimeout2");
//   Promise.resolve().then(() => console.log("promise2"));
// });

// console.log(1);
// setImmediate(() => console.log(2));
// console.log(3);

// setTimeout(() => console.log("setTimeout"));
// setImmediate(() => console.log("setImmediate"));

setTimeout(() => {
  Promise.resolve().then(() => console.log("promise"));
  process.nextTick(() => console.log("nextTick"));
});
setImmediate(()=> console.log('setImmediate'));