const mysql = require("mysql")

var mysqlConnection = mysql.createConnection({
    host: "10.20.30.164",
    port: "3308",
    user: "data_user",
    password: "Jesusbewithme1",
    database: "data",
    multipleStatements: true
})

mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connected");
    }
    else{
        console.log("Connection Failed")
    }
})

module.exports = mysqlConnection;