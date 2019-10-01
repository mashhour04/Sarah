const { messengerService } = require('./messenger');
class SenderService {
  static sendGreetingMessage(user) {
    console.log('sending greeting');
    const text = 'Ola';
    const quickReplies = [
      {
        content_type: 'text',
        title: 'Configure Sarah',
        payload: JSON.stringify({ action: 'configure_sarah' })
      }
    ];
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies)
  }
}

module.exports = SenderService;
