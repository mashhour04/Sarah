const { Router } = require('express');
const { check } = require('express-validator/check');

const { userController } = require('../../controllers/api/userController');

const router = Router();

const registerPropType = [
  // firstName must exist
  check('firstName').isLength(({ min: 3 })),
  // lastName must exist
  check('lastName').isLength(({ min: 3 })),
  // username must exist with certain length
  check('username').isLength(({ min: 3 })),
  // phone number must be mobile phone
  check('phone').isMobilePhone('any'),
  // username must be an email
  check('email').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 8 })
];

router.get('/', userController.get.bind(userController));
router.post('/register', userController.register.bind(userController));

class UserRouter {
  constructor() {
    this.registerPropType = registerPropType;
    this.router = router;
    this.managerRegister = userController.register.bind(userController);
  }

  get getRegisterPropType() {
    return this.registerPropType;
  }

  get getManagerRegister() {
    return this.managerRegister;
  }

  get getRouter() {
    return this.router;
  }
}
module.exports = { userRouter: new UserRouter() };
