var express = require('express');
var router = express.Router();
const _ = require('lodash')
const db = require("../db/index")
const {toHump, excludeRes} = require("../utils/handleRes");
const {v4: uuidv4} = require("node-uuid")
const {forIn} = require("lodash/object");
const {forEach} = require("lodash/fp/_util");
const {forEachRight} = require("lodash/collection");
const {saveForm, saveItems, getForm, getItems, updateForm, deleteForm, deleteItems} = require("./handler/register")
const {promiseImpl} = require("ejs");


router.post("/register/list", function (req, res) {
    const info = req.body
    // console.log("开始查询", info)
    const start = (info.pageNum - 1) * info.pageSize
    const end = info.pageNum * info.pageSize
    const sql = `SELECT * FROM list_tms_register WHERE apply_notice_name LIKE '%${info.applyNoticeName}%' AND delete_flag = 1 LIMIT ${start+','+end}`
    const sqlTotal = `SELECT COUNT(*) FROM list_tms_register WHERE delete_flag = 1 `
    const list = new Promise((resolve, reject) => {
        db.query(sql, info.applyNoticeName, (err, results) => {
            results = toHump(results)
            results = excludeRes(results, ['deleteFlag'])
            if (err) return res.resErr(err)
            resolve(results)
        })
    })
    const total = new Promise((resolve, reject) => {
        db.query(sqlTotal, (err, results) => {
            // console.log("results", results)
            results = toHump(results)
            results = excludeRes(results, ['deleteFlag'])
            if (err) return res.resErr(err)
            resolve(results)
        })
    })
    Promise.all([list, total]).then((datas => {
        // console.log(datas)
        // console.log(datas[0])
        // console.log(datas[1])
        res.send({data: datas[0], status: 1, total: datas[1][0].count, msg: "请求成功"})
    }))


})

router.post("/register/save", async function (req, res) {
    let info = req.body
    //新主单据
    if (!info.registerForm.id) {
        let formId = uuidv4()
        const isSaveForm = await saveForm(info.registerForm, res, formId)
        const isSavedItems = await saveItems(info.registerItems, res, formId)
        Promise.all([isSaveForm, isSavedItems]).then((success) => {
            return res.send({
                status: 1,
                data: formId,
                msg: "保存成功"
            })
        })
        //有主单据 更改
    } else {
        const isUpdateForm = await updateForm(info.registerForm, res)
        const isSavedItems = await saveItems(info.registerItems, res, info.registerForm.id)
        // console.log("两个执行完", isUpdateForm, isSavedItems)
        // 更新成功
        Promise.all([isUpdateForm, isSavedItems]).then((success) => {
            return res.send({
                status: 1,
                data: info.registerForm.id,
                msg: "保存成功"
            })
        })
    }

})

router.get("/register/get", async function (req, res) {
    const registerForm = await getForm(req.query.registerId, res)
    const registerItems = await getItems(req.query.registerId, res)
    let data = {
        registerForm,
        registerItems: toHump(registerItems)
    }
    Promise.all([registerItems, registerForm]).then(success => {
        res.send({status: 1, data, msg: "查询成功"})
    })
})

router.post("/register/deleteForm", async function (req, res) {
    // console.log("开始删除表单")
    const isDelete = await deleteForm(req.body.idList, res)
    // console.log("执行玩", isDelete)
    if (isDelete) {
        res.send({status: 1, msg: "删除成功"})
    }
})

router.post("/register/deleteItems", async function (req, res) {
    // console.log("开始山水城")
    const isDelete = await deleteItems(req.body.idList, res)
    if (isDelete) {
        res.send({status: 1, msg: "删除成功"})
    }
})

module.exports = router