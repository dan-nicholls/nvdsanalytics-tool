var express = require("express");
const path = require("path");
var app = express();

const PORT = 3000;

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "./index.html"));
// });

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
