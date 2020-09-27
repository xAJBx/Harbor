
const express = require("express")
const bodyParser = require("body-parser")
const os = require('os');
const mysqlConnection = require("./connect")
const ifaces = os.networkInterfaces();
const connectMongoDB = require('./config/mongoDB');

// trying to https
const https = require('https');
const fs = require('fs');

const DataRoute = require("./routes/data"); 
const ErrorRoute = require("./routes/error");
const UserRoute = require("./routes/users");
const AuthRoute = require("./routes/auth");
const ProfileRoute = require("./routes/profile");
const PostsRoute = require("./routes/posts");

let serverIP;
let httpPort = 50091;
let httpsPort = 5010;

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
  
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
  
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
        serverIP = iface.address;

      }
      ++alias;
    });
  });

  var app = express()

// Init Middleware
app.use(express.json({extended: false}));


app.use(bodyParser.json())

app.use("/data", DataRoute);
app.use("/error", ErrorRoute);
app.use("/users", UserRoute);
app.use("/auth", AuthRoute);
app.use("/profile", ProfileRoute);
app.use("/posts", PostsRoute);


const PORT = process.env.PORT || httpPort;
const IP = process.env.IP 
app.listen(PORT, () => console.log(`Server started on IP: ${IP} port: ${PORT}`));

// connect to mongo
connectMongoDB();

// https server
//https.createServer({
//  key: fs.readFileSync('./key.pem'),
//  cert: fs.readFileSync('./cert.pem'),
//  passphrase: 'Jesusbewithme1'
//}, 
//app).listen(httpsPort);

// call sp for inserting server data to db
mysqlConnection.query(`CALL spINSERT_Harbor_Details('${serverIP}', '${httpsPort}', '${httpPort}')`);

