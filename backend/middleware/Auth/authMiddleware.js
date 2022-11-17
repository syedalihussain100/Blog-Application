const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/User/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
    
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        // find the user by id
        const user = await User.findById(decoded?.id).select("-password");
        
        // attach the user to the request
        req.user = user;

        next();
      } else {
        res.status(404);
        throw new Error("There is no token attached to the header");
      }
    } catch (error) {
      res.status(401);
      throw new Error("No authorized token expired, login again");
    }
  }else{
    throw new Error("There is no token attached to the header")
  }
});

module.exports = authMiddleware;
