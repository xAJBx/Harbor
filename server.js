
const express = require("express")
const bodyParser = require("body-parser")
const os = require('os');
const mysqlConnection = require("./connect")
const ifaces = os.networkInterfaces();

const DataRoute = require("./routes/data"); 
const ErrorRoute = require("./routes/error");

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
      }
      ++alias;
    });
  });

  var app = express()
app.use(bodyParser.json())

app.use("/data", DataRoute);
app.use("/error", ErrorRoute);


const PORT = process.env.PORT || 5009
const IP = process.env.IP 
app.listen(PORT, () => console.log(`Server started on IP: ${IP} port: ${PORT}`));
