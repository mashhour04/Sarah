const webHookController = require('../controllers/webhookController');
const { Router } = require('express');

const router = Router();

router.get('/', webHookController.verify);
router.post('/', webHookController.webhook);
class WebHookRouter {
  constructor() {
    this.router = router;
  }

  get getRouter() {
    return this.router;
  }
}
module.exports = { webHookRouter: new WebHookRouter() };
