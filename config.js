const fetch = require("node-fetch");
const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.listen(port, () => console.log(`Listening on port ${port}`));
app.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const api_key = req.body["api-key"];
  const vu = req.body.vu;
  const rampUpDuration = req.body.rampUpDuration;
  const domain = req.body.domainURL;
  // res.json({
  //   username,
  //   password,
  //   api_key,
  //   domain,
  //   apiEndPoint,
  //   rampUpDuration,
  //   vu,
  // });
  function runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let output = "";

      process.stdout.on("data", (data) => {
        const newData = data.toString();
        output += newData;
        res.write(newData);
      });

      process.stderr.on("data", (data) => {
        const errorData = data.toString();
        console.error(errorData);
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });
    });
  }

  runCommand("k6", [
    "run",
    "--env",
    `USERNAME=${username}`,
    "--env",
    `PASSWORD=${password}`,
    "--env",
    `APIKEY=${api_key}`,
    "--env",
    `DOMAIN=${domain}`,
    "--env",
    `RAMPUPDURATION=${rampUpDuration}`,
    "--env",
    `VU=${vu}`,
    "/Users/mymac/Documents/trying_connecting/script.js",
  ])
    .then((output) => {
      console.log("Command completed successfully.");
      // res.send(output); // Send output as response
      res.end();
    })
    .catch((error) => {
      console.error("An error occurred while running the command:", error);
      res.status(500).send(error.message); // Send error message as response
    });
});

// app.use(
//   "/db",
//   createProxyMiddleware({
//     target: "http://127.0.0.1:5665/ui/?endpoint=/",
//     changeOrigin: true,
//     // pathRewrite: {
//     //   [`^/`]: "",
//     // },
//   })
// );

// app.use(
//   "/",
//   createProxyMiddleware({
//     target: "http://127.0.0.1:5665/ui/",
//     changeOrigin: true,
//     // pathRewrite: {
//     //   [`^/`]: "",
//     // },
//   })
// );

// app.get("/db", (req, res) => {
//   console.log("hi")
//   fetch("http://127.0.0.1:5665/ui/?endpoint=/").then((r) => {
//     // console.log(r)
//     return r.text()
//   }).then(d => { console.log(d); res.send(d);});
// });