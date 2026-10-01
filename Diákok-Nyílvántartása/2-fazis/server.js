
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("A JSON szerver működik!");
});
app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`);
});