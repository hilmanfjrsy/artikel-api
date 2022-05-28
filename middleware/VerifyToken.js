const jwt = require("jsonwebtoken");

module.exports = function () {
  return async function (req, res, next) {
    let token = req.headers["authorization"];
    if (!token) {
      var response = {
        message: "No token provided!"
      }
      return res.status(403).send(response);
    } else {
      jwt.verify(token, process.env.SECRET, async function (err, decoded) {
        
        if (!err) {
          req._user_id = decoded.id
          req._req_dateTime = new Date()
          next()
        } else {
          var response = {
            message: "Sesi telah habis",
          }
          return res.status(401).send(response)
        }
      })
    }
  }
}