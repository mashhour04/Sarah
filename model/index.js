const { connection } = require('./config');
const userSchema = require('./userScheama');


module.exports = {
  userModel: connection.model('User', userSchema),
};
