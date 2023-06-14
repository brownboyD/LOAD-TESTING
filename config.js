const fetch = require("node-fetch");
const express = require("express");
const multer = require("multer");
const app = express();
const port = 8080;
const { spawn } = require("child_process");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.listen(port, () => console.log(`Listening on port ${port}`));

const upload = multer().single("jsonFile");

app.post("/", upload, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const api_key = req.body["api-key"];
  const vu = req.body.vu;
  const rampUpDuration = req.body.rampUpDuration;
  const domain = req.body.domainURL;

  // Read the uploaded JSON file as a string
  const fileContent = req.file.buffer.toString();

  function runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);

      process.stdout.on("data", (data) => {
        console.log(data.toString());
      });

      process.stderr.on("data", (data) => {
        console.error(data.toString());
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });

    });
  }

  // Parse the uploaded JSON file content as an object
  // const jsonData = JSON.parse(fileContent);

  // for (let i = 0; i < jsonData.length; i++) {
  //   console.log(jsonData[i]);
  // }
  // Run the k6 script with the uploaded JSON data

  
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
    "--env",
    `JSONDATA=${fileContent}`,
    "/Users/mymac/Documents/trying_connecting/script.js",
  ])
    .then((output) => {
      console.log("Command completed successfully.");
      res.end();
    })
    .catch((error) => {
      console.error("An error occurred while running the command:", error);
      res.status(500).send(error.message);
    });
});
