var express = require('express');
var router = express.Router();

const {getRouters} = require("./handler/routers")

router.get("/getRouters",function (req,res) {
    const userInfo = {
        username: req.auth.username,
        userId: req.auth.userId
    }
    getRouters(userInfo,res)

})



module.exports = router