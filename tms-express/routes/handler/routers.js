const db = require("../../db/index")
const {func} = require("joi");
const {toHump} = require("../../utils/handleRes")

function getRouterTree(arr) {
    const map = arr.reduce((acc, val) => {
        acc[val.id] = val
        return acc
    }, {})
    // console.log(map)
    const tree = []
    arr.forEach(region => {
        if (region.parentMenu) {
            const parent = map[region.parentMenu]
            if (!parent.children) {
                parent.children = [region]
            } else {
                parent.children.push(region)
            }
        } else {
            tree.push(region)
        }
    })
    return {tree}
}

function treeToRouter(data) {
    for (let i = 0; i < data.length; i++) {
        // delete data[i].id
        delete data[i].parentMenu
        delete data[i].menuIndex
        if (data[i].children) {
            treeToRouter(data[i].children)
        }


    }
    return data
}

function getRouters(userInfo, res) {
    // console.log(",userInfouserInfo", userInfo)
    const sql = "SELECT id,name,parent_menu,menu_index,path,component FROM menu WHERE id IN (SELECT menu_id FROM roles_menu_intermediate WHERE role_id = (SELECT role_id FROM ev_users WHERE username = ?))&&delete_flag=1;"
    db.query(sql, userInfo.username, (err, results) => {
        if (err) return res.resErr()
        let data = toHump(results)
        const {tree} = getRouterTree(data)
        const routers = treeToRouter(tree)
        console.log(routers)
        res.send({status: 0, data: routers, msg: "成功"})
    })

}

module.exports = {
    getRouters
}