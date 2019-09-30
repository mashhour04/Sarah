/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const log = require('npmlog');

const { Schema } = mongoose;
const { messengerService } = require('../services/messenger');

const { messenger } = messengerService;
const bookingSchema = new Schema({
  bookingId: {
    type: String,
    ref: 'Booking'
  },

  vendorId: {
    type: String,
    ref: 'Vendor',
    required: true
  },

  date: {
    type: Date
  }
});

const userSchema = new Schema({
  fbid: {
    type: String,
    index: 1
  },

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
  },

  step: {
    type: String
  }
});

/**
 * Statics
 */
userSchema.statics = {
  async findOrCreate(fbid, projection) {
    const users = await this.find({ fbid }, projection).exec();
    if (users.length && users.length > 0) {
      if (!users[0].session) {
        users[0].session = {};
      }
      return users[0];
    }
    const profile = await getProfile(fbid);
    const user = await this.create(profile);
    return user;
  }
};

async function getProfile(fbid) {
  const res = await messenger.getProfile({ id: fbid });
  if (res.error) {
    throw res.error;
  }
  log.info('response from profile', res);
  const { first_name, last_name } = res;
  res.fbid = fbid;
  res.firstName = first_name;
  res.lastName = last_name;
  return res;
}
module.exports = userSchema;
