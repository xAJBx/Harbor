const mysql = require("mysql")

var mysqlConnection = mysql.createConnection({
    //host: "192.168.3.223",
    host: "10.20.30.198",
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