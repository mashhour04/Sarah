const log = require('npmlog');
const config = require('config');
const phoneValidation = require('phone-number-validation');

const senderService = require('../services/senderService');
const { userModel } = require('../model');
const { messengerService } = require('../services/messenger');

const PostBackReceiver = require('../services/receivers/postBackReceiver');
const QuickReplyReceiver = require('../services/receivers/quickReplyReceiver');
const TextsReceiver = require('../services/receivers/textsReceiver');

const { messenger, firstEntity } = messengerService;

const validationAPI = new phoneValidation({
  access_key: 'bd802393d1e2cd2f7e56744f23162ce2',
});

const caller = () => true;
class WebHookController {
  constructor() {
    caller = () => true;
  }

  static verify(req, res) {
    caller();
    log.info('verifiying');
    console.log(
      'verifying',
      req.query['hub.verify_token'],
      config.get('verify_token'),
    );
    if (req.query['hub.verify_token'] === config.get('verify_token')) {
      log.info('TOKEN VERIFIED');
      res.send(req.query['hub.challenge']);
    }
  }

  static async webhook(req, res) {
    try {
      res.status(200).send('okay');
      const { entry } = req.body;
      const { messaging } = entry[0];
      messaging.map(async (event) => {
        const fbid = event.sender.id;
        const user = await userModel
          .findOrCreate(fbid, {
            fbid: 1,
            firstName: 1,
            lastName: 1,
            step: 1,
            session: 1,
            cache: 1,
            email: 1,
            phone: 1,
          })
          .catch((err) => {
            messenger.sendTextMessage({
              id: fbid,
              text: 'Sorry, But something went wrong',
            });
            console.error(err);
          });
        if (user.error) {
          return;
        }
        WebHookController.eventDetector(user, event);
      });
      return true;
    } catch (err) {
      logger.error(err.stack);
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // eslint-disable-next-line consistent-return
  static async eventDetector(user, event) {
    log.info('the user in event detector', user);
    const { message, postback, referral } = event;
    if (message) {
      const { text } = event.message;
      const quickReply = event.message.quick_reply;
      if (quickReply) {
        log.info('QUICK REPLY CHECK');
        log.info('Quick Reply is', JSON.stringify(event.message.quick_reply));
        const { payload } = quickReply;
        QuickReplyReceiver.router(user, event);
      } else if (text) {
        const { nlp } = message;
        if (user.step) {
          WebHookController.checkForInput(user, text);
        // } else if (nlp) {
        //   log.info('the nlp', nlp, nlp.entities[Object.keys(nlp.entities)]);
        //   const greetings = firstEntity(nlp, 'Greetings');
        //   log.info('if gereetings ', greetings);
        //   if (!greetings) {
        //     log.info('user', user);
        //     return senderService.sendAliWelcome(user.fbid);
        //   }
        //   // handleEntity();
        } else {
          console.log('a text message ee ');
          TextsReceiver.router(user, event);
          // sendNotUnderstanding(user);
        }
      }
    } else if (postback) {
      logger.info(
        `Postback Check! senderId: ${event.sender.id}; payload: ${event.postback.payload}`,
      );
      PostBackReceiver.router(user, event);
    } else if (referral) {
      log.info('referral CHECK', event.referral.ref);
      // postBacks.receivedReferral(user, event);
    } else {
      log.info('received unknown event', event);
    }
  }

  static async validatePhoneNumber(number) {
    return new Promise((resolve, reject) => {
      let query = {
        number,
      };
      validationAPI.validate(query, (err, result) => {
        if (err) {
          resolve({ err, success: false });
          return log.info('Validate Callback (Error): ' + JSON.stringify(err));
        }
        log.info('Validate Callback (Success): ' + JSON.stringify(result));
        resolve({ success: true, result });
      });
    });
  }

  static async checkForInput(user, text) {
    if (user.step == 'phone') {
      const response = await WebHookController.validatePhoneNumber(text);
      if (response.success && response.success == true) {
        log.info('Results', response.result.valid);
        if (response.result.valid == true) {
          user.phone = text;
          await user.save();
        }
        user.step = null;
        await user.save();
        await senderService.sendAliWelcome(user.fbid, true);
      } else {
        user.step = null;
        await user.save();
      }
    }
  }
}

module.exports = WebHookController;
