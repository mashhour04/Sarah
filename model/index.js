const { connection } = require('./config');
const userSchema = require('./userSchema');
const adminSchema = require('./adminSchema');

module.exports = {
  userModel: connection.model('User', userSchema),
  adminModel: connection.model('Admin', adminSchema)
};
