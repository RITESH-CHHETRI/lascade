const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    process.stdout.write(`Access denied\n`);
    return res.status(401).send({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
    process.stdout.write(`Accessed\n`);
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
  }
};
