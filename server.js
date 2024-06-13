const express = require("express")
const app = express();
const dotenv = require("dotenv")
const cors = require("cors")
const DbConnection = require("./Db/Db_connection")
const fileRoutes = require("./routes/fileRoute")
dotenv.config();

app.use(express.json())
app.use(cors("*"))

DbConnection()

const port = process.env.PORT || 4600;


app.use("/api", fileRoutes);

app.get("/",(req,res)=>{
    res.send({message : "welcome to file upload"})
})

app.listen(port,()=>{
    console.log( `The server run on port ${port}`)
})