const express = require('express');
// const app=express();
const router=express.Router()

router.route("/studentRegistration").post((req,res)=>{
    console.log("This is student registration route.(Working)");
})

module.exports = router;