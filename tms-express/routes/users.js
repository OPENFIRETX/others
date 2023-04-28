var express = require('express');
var router = express.Router();

const db = require("../db/index")

// JWT
const jwt = require("jsonwebtoken")
// const expressJWT = require("express-jwt")
const secretKey = "RONALDO"

//加密密码
const bcrypt = require("bcryptjs")

//生成id
const {v4: uuidv4} = require("node-uuid")

//注册校验
const expressJoi = require("@escook/express-joi")
const {regLoginSchema} = require("../schema/user")
// console.log("regLoginSchema", regLoginSchema)
/* GET users listing. */
router.post('/login', function (req, res, next) {
    // console.log("后 reqreq",req.body);
    const userInfo = req.body
    //权限
    const loginStr = "SELECT * FROM ev_users where username=?"
    db.query(loginStr, [userInfo.username], (err, results) => {
        if (err) return res.resErr(err)
        if (results.length !== 1) return res.resErr("不存在此用户")

        const resPwd = bcrypt.compareSync(userInfo.password, results[0].password)
        // console.log(results[0])
        if (!resPwd) return res.resErr("登录失败，密码错误")


        const token = jwt.sign({username: userInfo.username, userId: results[0].id}, secretKey, {expiresIn: "36000s"})
        res.send({
            status: 0,
            data: token,
            msg: "登录成功",
        });
    })


});

router.post("/signUp", expressJoi(regLoginSchema), function (req, res) {
    const userInfo = req.body
    // if (!req.body.username || !req.body.password) {
    //     res.send({
    //         status: 1,
    //         msg: "请完整填写数据"
    //     });
    //     return
    // }
    // console.log(req.body)
    //用户名是否重复
    const queryStr = "select * from ev_users where username = ?"
    db.query(queryStr, userInfo.username, (err, results) => {
        //错误
        if (err) {
            return res.send({status: 1, msg: err.message})
        }
        //重复
        if (results.length > 0) {
            return res.send({status: 1, msg: "用户名已经被占用"})
        }

        //密码检验
        // const patrn = /^(\w){6,20}$/;
        // if (!patrn.exec(userInfo.password)) {
        //     return res.send({
        //         status: false, msg: "只能输入6-20个字母、数字、下划线"
        //     })
        // }

        //加密密码
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        const userId = uuidv4("ronaldo", "111111111111111")

        //成功
        const insertStr = "INSERT INTO ev_users SET ?"
        db.query(insertStr, {id: userId, username: userInfo.username, password: userInfo.password}, (err, results) => {
            //错误
            if (err) {
                return res.send({status: 1, msg: err.message})
            }
            // results.affectedRows：受影响的行数，如果大于0就表示成功新增
            if (results.affectedRows !== 1) {
                return res.send({status: 1, msg: "注册失败"})
            }
            return res.send({
                status: 0, msg: "注册成功"
            })

        })

    })

})

router.get("/getUserInfo", function (req, res) {
    // console.log(req.auth)
    const userInfo = {
        username: req.auth.username,
        userId: req.auth.userId
    }
    return res.send({status: 0, data: userInfo, msg: "获取成功"})
})

module.exports = router;
