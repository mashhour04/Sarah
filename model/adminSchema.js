/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const log = require('npmlog');

const { Schema } = mongoose;
const { messengerService } = require('../services/messenger');

const { messenger } = messengerService;

const adminSchema = new Schema({
  facebookAppId: {
    type: String,
    index: 1
  },
  accessToken: String,
  refreshToken: String,
  profile: mongoose.Schema.Types.Mixed,

  firstName: {
    type: String
  },

  lastName: {
    type: String
  },

  email: {
    type: String
  },

  phone: {
    type: Number
  },

  gender: {
    type: String
  },

  locale: {
    type: String
  },
  session: {
    type: Schema.Types.Mixed,
    default: {}
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

/**
 * Statics
 */
adminSchema.statics = {
  async findOrCreate({ facebookAppId, profile, accessToken, refreshToken }, projection = {}) {
    const users = await this.find(
      { facebookAppId, profile },
      projection
    ).exec();
    if (users.length && users.length > 0) {
      if (!users[0].session) {
        users[0].session = {};
      }
      return users[0];
    }

    console.log('log profile', profile);
    const user = await this.create({ facebookAppId, profile, accessToken, refreshToken });
    return user;
  }
};

module.exports = adminSchema;
