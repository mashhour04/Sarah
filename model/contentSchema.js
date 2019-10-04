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


const contentSchema = new Schema({
  from: {
    name: String,
    id: String,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },
  updated_time: {
    type: Date,
    default: Date.now,
  },

  description: String,
  text: String,
  story: String,
  message: String,
  is_hidden: Boolean,
  id: {
    type: String,
    index: 1,
  },


  fbid: {
    type: String,
    index: 1,
  },
  full_picture: String,
  attachments: [{
    media_type: String,
    url: String,
    description: String,
    media: {
      type: Schema.Types.Mixed,
    },
    subattachments: [{
      media: {
        type: Schema.Types.Mixed,
      },
    }],
  }],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

});


module.exports = contentSchema;
