// { data: 
//     [ { message: 'A7a',
//         updated_time: '2019-09-30T18:59:33+0000',
//         id: '392352701458597_392356124791588' },
//       { story: 'Ahmed Mashhour Alyamany created the group Sarah-Test-Group.',
//         updated_time: '2019-09-30T18:50:21+0000',
//         id: '392352701458597_392352711458596' } ]

/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const log = require('npmlog');

const { Schema } = mongoose;
const { messengerService } = require('../services/messenger');

const { messenger } = messengerService;


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


module.exports = contentSchema;
