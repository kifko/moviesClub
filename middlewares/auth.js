const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header.authorization;
    const payload = jwt.verify(token, 'SecretToken');
    const user = await User.findByPk(payload.id);
    const tokenFound = await Token.findOne({
      where : {
        token : token,
        UserId : payload.id,
        revoked : false
      }
    });
    if(!user || !tokenFound) {
      return res.status(401).send({ message : 'Non authorized'});
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    res.status(403).send({ message : 'An error occour'});
  }
}
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ message : 'No admin privileges'});
  }
  next();
}
module.exports = {
  auth,
  isAdmin
}