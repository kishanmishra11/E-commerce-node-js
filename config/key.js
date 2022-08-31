require('dotenv').config()

module.exports = {
    META_STATUS_0 : 0,
    META_STATUS_1 : 1,
    SUCCESSFUL : 200,
    VALIDATION_ERROR : 400,
    INTERNAL_SERVER_ERROR : 500,
    ACTIVE:1,
    INACTIVE:2,
    DELETED:3,
    DB_URL : process.env["DB_URL"] ,
    PORT  : process.env["PORT"],
    SALT  : process.env["SALT"],
    TOKEN_EXPIRE_TIME : process.env["TOKEN_EXPIRE_TIME"] ,
    SECRET_KEY  : process.env["SECRET_KEY"],
    EMAIL : process.env["EMAIL"] ,
    PASSWORD : process.env["PASSWORD"]
}