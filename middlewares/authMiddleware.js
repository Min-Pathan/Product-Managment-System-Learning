const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.json({ msg: "No token provided" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded; // store user info

    next();

  } catch (err) {
    res.json({ msg: "Invalid token" });
  }
};

const adminMiddleware = async(req, res, next)=>{
    if(req.user.role  !== "admin"){
         return res.json({ msg: "Access denied. Admin only" });
    }
    next()
}

module.exports = {authMiddleware, adminMiddleware};