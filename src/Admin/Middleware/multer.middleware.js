const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "D:\\MYFOLDER\\Mca\\MCA2022-2024\\Project-Sem-4\\Automation_Project\\public\\temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ 
    storage, 
})
module.exports = {upload}