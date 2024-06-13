const mongoose = require('mongoose')


const DbConnection =async(req,res)=>{

    try{

        await mongoose.connect(process.env.MONGO_URL)

        console.log("The Db Connected")

    }catch(err){
        console.log(err.message)
    }
}

module.exports = DbConnection;