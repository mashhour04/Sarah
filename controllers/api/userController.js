const log = require('npmlog');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { validationResult } = require('express-validator/check');

const { userModel } = require('../../model');

class User {
  constructor() {
    this.model = userModel;
  }

  async get(req, res) {
    try {
      // Finds the validation errors in this request and wraps them in
      // an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // const userData = req.body;
      const userId = req.user._id;
      const response = await this.model.findById(userId, { hashed_password: false }).lean().exec();
      return res.status(200).json(response);
    } catch (err) {
      log.error(err.stack);
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async register(req, res) {
    const userId = ObjectId();
    try {
      // Finds the validation errors in this request and wraps them in
      // an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // const userData = req.body;

      const user = await this.model.create(req.body);
      user.save();
      return res.status(200).json({ success: true, response: { user } });
    } catch (err) {
      log.error(err.stack);
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      // Finds the validation errors in this request and wraps them in
      // an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // const userData = req.body;
      const userId = req.user._id;
      const response = this.model.findByIdAndUpdate(userId, { $set: req.body });
      return res.status(200).json({ success: true, response });
    } catch (err) {
      log.error(err.stack);
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

module.exports = { userController: new User() };
