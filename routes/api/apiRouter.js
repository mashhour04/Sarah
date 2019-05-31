const { Router } = require('express');

const router = Router();
const { userRouter } = require('./userRouter');



router.use('/users', userRouter.router);
class API {
  constructor() {
    this.router = router;
    this.userRouter = userRouter;
  }

  get getRouter() {
    return this.router;
  }
}
module.exports = { apiRouter: new API() };
