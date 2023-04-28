const express = require('express');
const router = express.Router();

const db = require("../db/index")
const {toHump, excludeRes} = require("../utils/handleRes");

router.post("/waitList", function (req, res) {
    const info = req.body
    // console.log(info)
    res.send({
        status: 1, data: {
            data: [{
                title: 'string',
                createTime: 'string',
                creatorName: 'string',
                taskName: 'string',
                currentLink: 'string',
                moduleName: 'string',
            }],
            total: 2
        }
    })
})

router.post("/doneList", function (req, res) {
    const info = req.body
    // console.log(info)
    res.send({
        status: 1, data: {
            data: [{
                title: '222',
                createTime: 'string',
                creatorName: '222',
                taskName: 'string',
                currentLink: 'string',
                moduleName: 'string',
            }],
            total: 2
        }
    })
})

module.exports = router