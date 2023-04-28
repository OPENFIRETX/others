const joi = require("joi")

const username = joi.string().min(2).max(12).required()
const password = joi.string().pattern(/^[\S]{5,15}$/).required()


exports.regLoginSchema = {
    body: {
        username,
        password
    }
}
