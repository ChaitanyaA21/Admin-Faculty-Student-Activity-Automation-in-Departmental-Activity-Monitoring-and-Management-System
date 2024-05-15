const mongoose = require('mongoose')
const DB_NAME=require("../../constants")


const connectDB =async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    
  } catch (error) {
    console.log("Error:",error);
  }
}





// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
// }



module.exports = connectDB