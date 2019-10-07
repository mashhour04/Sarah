// { data:
//     [ { message: 'A7a',
//         updated_time: '2019-09-30T18:59:33+0000',
//         id: '392352701458597_392356124791588' },
//       { story: 'Ahmed Mashhour Alyamany created the group Sarah-Test-Group.',
//         updated_time: '2019-09-30T18:50:21+0000',
//         id: '392352701458597_392352711458596' } ]

/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const keywords = new Schema({
  keyword: String,
  type: {
    type: String,
    enum: ['good', 'bad'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = keywords;
