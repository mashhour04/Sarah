const { messengerService } = require('./messenger');
class SenderService {
  static sendGreetingMessage(user) {
    console.log('sending greeting');
    const text = 'Ola';
    messengerService.sendTextMessage(user.fbid, text);
  }
}

module.exports = SenderService;
