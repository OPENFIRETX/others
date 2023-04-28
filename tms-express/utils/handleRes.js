const _ = require('lodash')
const {forIn} = require("lodash/object");
const {func} = require("joi");


//对象数组的每一项 的key转换成驼峰
function toHump(listData) {
    for (let i = 0; i < listData.length; i++) {
        for (let listDataKey in listData[i]) {
            listData[i][_.camelCase(listDataKey)] = listData[i][listDataKey]
            if (listDataKey !== _.camelCase(listDataKey)) {
                delete listData[i][listDataKey]
            }
        }
    }
    return listData
}

//对象数组每一项 key转化成下划线
function toLine(listData) {
    let newKey
    for (let i = 0; i < listData.length; i++) {
        newKey = ""
        for (let formKey in listData[i]) {
            newKey = formKey.replace(/([A-Z])/g, "_$1").toLowerCase()
            listData[i][newKey] = listData[i][formKey]
            // console.log(newKey, formKey)
            if (newKey !== formKey) {
                delete listData[i][formKey]
            }
        }
    }
    return listData
}


function objArrToArr(objArray) {
    let newArray = []
    for (let i = 0; i < objArray.length; i++) {
        let doubleArr = []
        for (const objArrayKey in objArray[i]) {
            doubleArr.push(objArray[i][objArrayKey])
        }
        newArray.push(doubleArr)
    }
    return newArray
}


//对象数组  转换成  二维数组和key 下划线数组
function objArrToKeysAndArr(objArray) {
    let newArr = []
    let keys = []
    for (let i = 0; i < objArray.length; i++) {
        let doubleArr = []
        for (const objArrayKey in objArray[i]) {
            if (i === 0) {
                keys.push(objArrayKey.replace(/([A-Z])/g, "_$1").toLowerCase())
            }
            doubleArr.push(objArray[i][objArrayKey])
        }
        newArr.push(doubleArr)
    }
    return {
        keys, newArr
    }
}

// 对象数组 每一项的key排序
function sortObjKeys(array) {
    if (array.length === 0) return []
    //key 排好序
    let keyList = []
    for (const arrayKey in array[0]) {
        keyList.push(arrayKey)
    }
    // 排好序的数组
    let newArray = []
    for (let i = 0; i < array.length; i++) {
        let item = {}
        for (let j = 0; j < keyList.length; j++) {
            const key = keyList[j]
            item[key] = array[i][key]
        }
        newArray.push(item)
    }
    return newArray

}

// 去掉数组对象每一项的 deleteFlag
// [{},{}]
function excludeRes(arr, keys) {

    arr.map(row => {
        keys.forEach(key => {
            delete row[key]
        })
       return row
    })
    return arr

}


module.exports = {toHump, toLine, objArrToArr, objArrToKeysAndArr, sortObjKeys, excludeRes}