const express = require("express");
const{ mongoose } = require("mongoose");
const app = express();

app.use(
    cors(
        {
            origin:"http://localhost:3000",
        }
    ));
    app.use(express.json());
    app.use("/",routes)

    const PORT =5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    mongoose.connect("mongodb://mongodb:27017/VOTINGAPP");
    const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
  });
  
  database.once("connected", () => {
    console.log("Database Connected");
  });