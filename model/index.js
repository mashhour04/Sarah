const { connection } = require('./config');
const userSchema = require('./userSchema');
const adminSchema = require('./adminSchema');
const contentSchema = require('./contentSchema');
const keywords = require('./keywords');

module.exports = {
  userModel: connection.model('User', userSchema),
  adminModel: connection.model('Admin', adminSchema),
  contentModel: connection.model('Content', contentSchema),
  keywordsModel: connection.model('Keyword', keywords),
};
