const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;


const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
  },

  hashed_password: {
    type: String,
  },

  username: {
    type: String,
    unique: true,
  },

  fcmTokens: {
    type: Array,
  },

  vendorId: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


// Virtuals
userSchema
  .virtual('password')
  // set methods
  // eslint-disable-next-line func-names
  .set(function (password) {
    // eslint-disable-next-line no-underscore-dangle
    this._password = password;
  });


// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  // store reference
  const user = this;
  // eslint-disable-next-line no-underscore-dangle
  if (user._password === undefined) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) { return; }
    // hash the password using our new salt
    // eslint-disable-next-line no-underscore-dangle
    bcrypt.hash(user._password, salt, (error, hash) => {
      if (error) { return; }
      user.hashed_password = hash;
      next();
    });
  });
  return true;
});

/**
 * Methods
*/
userSchema.methods = {
  comparePassword(candidatePassword) {
    return new Promise((resolve) => {
      console.log('this password', this.hashed_password);
      // eslint-disable-next-line consistent-return
      bcrypt.compare(candidatePassword, this.hashed_password, (err, isMatch) => {
        if (err) return resolve(false);
        resolve(isMatch);
      });
    });
  },
};

/**
 * Statics
 */
userSchema.statics = {
  async findByUsername(username) {
    const users = await this.find({ username }, { username: 1, hashed_password: 1, password: 1, vendorId: 1 }).exec();
    if (users.length && users.length > 0) { return users[0]; }
    return null;
  },
};

module.exports = userSchema;
