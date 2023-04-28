const {excludeRes, toLine, objArrToKeysAndArr, toHump, sortObjKeys} = require("../../utils/handleRes");
const db = require("../../db");
const {v4: uuidv4} = require("node-uuid");
const {result} = require("lodash/object");
const {forEach} = require("lodash/fp/_util");

function saveForm(formValue, res, formId) {
    formValue.id = formId
    formValue.deleteFlag = 1
    //生成编码
    formValue.applyNoticeCode = formValue.createTime + formValue.id.slice(0, 4)
    // 新增单据
    let formParams = toLine([formValue])[0]
    const addFormSql = "INSERT INTO list_tms_register SET ?"
    return new Promise((resolve, reject) => {
        db.query(addFormSql, formParams, (err, results) => {
            if (err) {
                res.resErr(err)
                resolve(false)
                return
            }
            if (results.affectedRows !== 1) {
                res.resErr("保存失败")
                resolve(false)
                return
            }
            resolve(true)
            return
        })
    })
}

function updateForm(formValue, res) {
    const id = formValue.id
    const updateFormSql = "UPDATE list_tms_register SET ? WHERE id=?"
    //主单据更新
    formValue = toLine([formValue])[0]
    return new Promise((resolve, reject) => {
        db.query(updateFormSql, [formValue, id], (err, results) => {
            if (err) {
                res.resErr(err)
                resolve(false)
            }

            resolve(true)
        })
    })

}


function saveItems(itemsValue, res, formId) {
    // 新增 商标
    if (itemsValue.length === 0) {
        return Promise.resolve(true)
    }
    // console.log("@@@@@@", itemsValue)
    itemsValue = excludeRes(itemsValue, ["key"])
    itemsValue.forEach(e => {
        if (!e.id) {
            e.id = uuidv4()
            e.registerId = formId
            e.trademarkCode = uuidv4().slice(0, 8)
        }
        e.deleteFlag = 1
    })
    let data = sortObjKeys(itemsValue)
    //data转换成二维数组和 下划线key的数组
    data = objArrToKeysAndArr(data)
    const addItemsSql = `INSERT INTO list_tms_trademark_item(${data.keys.toString()}) VALUES ? ON DUPLICATE KEY UPDATE id = VALUES(id),
trademark_category = VALUES(trademark_category),
icon = VALUES(icon),
remark = VALUES(remark),
trademark_code = VALUES(trademark_code),
trademark_name = VALUES(trademark_name),
trademark_category = VALUES(trademark_category),
is_color = VALUES(is_color),
register_id = VALUES(register_id),
delete_flag = VALUES(delete_flag)`

    // console.log("addItemsSql", addItemsSql)
    // itemsValue(data)
    return new Promise((resolve, reject) => {
        db.query(addItemsSql, [data.newArr], function (err, results) {
            if (err) {
                res.resErr(err)
                resolve(false)
                return
            }
            // 判断  新增+更新  ===  data长度
            if (results.affectedRows < 0) {
                res.resErr("保存失败")
                resolve(false)
                return

            }
            resolve(true)
            return
        })
    })


}

function getForm(id, res) {
    const searchSql = "SELECT * FROM list_tms_register WHERE id=? AND delete_flag = 1"
    return new Promise((resolve, reject) => {
        db.query(searchSql, id, function (err, results) {
            if (err) {
                res.resErr("查询失败")
                resolve(false)
                return
            }
            if (results.length !== 1) {
                res.resErr("查询失败")
                resolve(false)
                return
            } else {
                let data = toHump(results)[0]
                data = excludeRes([data], ["deleteFlag"])[0]
                resolve(data)
            }
        })
    })
}

function getItems(id, res) {
    const searchSql = "SELECT * FROM list_tms_trademark_item WHERE register_id=? AND delete_flag = 1"
    return new Promise((resolve, reject) => {
        db.query(searchSql, id, function (err, results) {
            if (err) {
                res.resErr("查询失败")
                resolve(false)
                return
            }
            // itemsValue(results)
            results = excludeRes(results, ['delete_flag'])
            resolve(results)
        })
    })
}


function deleteForm(ids, res) {
    return new Promise((overTrue, overFalse) => {
        let data = []
        ids.forEach((e, index) => {
            let doubleArr = []
            doubleArr.push(e)
            doubleArr.push(0)
            data.push(doubleArr)
        })
        const deleteSql = `INSERT INTO list_tms_register(id,delete_flag) VALUES ? ON DUPLICATE KEY UPDATE delete_flag = VALUES(delete_flag)`

        const pForm = new Promise((resolve, reject) => {
            db.query(deleteSql, [data], (err, results) => {
                if (err) {
                    res.resErr("form" + err)
                    resolve(false)
                    return
                }
                if (results.affectedRows > 0) {
                    resolve(true)
                }
            })
        })

        let itemsSql = 'UPDATE list_tms_trademark_item SET delete_flag = 0 WHERE '
        ids.forEach((e, index) => {
            if (index === 0) {
                itemsSql += `register_id = "${e}"`
            } else {
                itemsSql += " OR " + `register_id = "${e}"`
            }

        })

        const pItems = new Promise((resolve, reject) => {
            db.query(itemsSql, (err, results) => {
                if (err) {
                    res.resErr("item" + err)
                    resolve(false)
                    return
                }

                if (results.affectedRows > 0) {
                    resolve(true)
                }
            })
        })
        // console.log(pItems)
        // console.log(pForm)
        //
        // console.log("这里")

        Promise.all([pItems, pForm]).then(ok => {
            overTrue(true)
        }).catch(no => {
            overFalse(false)
        })

    })


}

function deleteItems(ids, res) {
    let data = []
    ids.forEach((e, index) => {
        let doubleArr = []
        doubleArr.push(e)
        doubleArr.push(0)
        data.push(doubleArr)
    })
    const sql = `INSERT INTO list_tms_trademark_item(id,delete_flag) VALUES ? ON DUPLICATE KEY UPDATE delete_flag = VALUES(delete_flag)`

    return new Promise((resolve, reject) => {
        db.query(sql, [data], (err, results) => {
            // console.log("resultsresultsresults",results)
            if (err) {
                res.resErr(err)
                resolve(false)
                return
            }
            if (results.affectedRows > 0) {
                resolve(true)
            }
        })
    })
}

module.exports = {
    saveItems, saveForm, getForm, getItems, updateForm, deleteForm, deleteItems
}
