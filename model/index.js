const { connection } = require('./config');
const userSchema = require('./userSchema');
const adminSchema = require('./adminSchema');
const contentSchema = require('./contentSchema');

module.exports = {
  userModel: connection.model('User', userSchema),
  adminModel: connection.model('Admin', adminSchema),
  contentModel: connection.model('Content', contentSchema),
};
