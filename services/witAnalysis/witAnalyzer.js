const { contentModel, keywordsModel } = require('../../model');
const wit = require('../training/wit');

const getContentSymbol = Symbol('getContentSymbol');
const getGoodKeywordSymbol = Symbol('getGoodKeywordSymbol');

class witAnalyzer {
  static async [getContentSymbol]() {
    try {
      const pendingContent = await contentModel
        .find({ status: 'pending', message: { $exists: true } })
        .select('message status');
      return pendingContent;
    } catch (error) {
      return false;
    }
  }

  static async [getGoodKeywordSymbol]() {
    try {
      const whiteList = await keywordsModel.find({ type: 'good' }).select('keyword type');
      return whiteList;
    } catch (error) {
      return false;
    }
  }

  static async analysis() {
    try {
      console.log('repeatedly analysis ===> start');
      const content = await this[getContentSymbol]();

      const whiteList = await this[getGoodKeywordSymbol]();

      if (!content || !whiteList || !content.length) return false;

      let whiteListRegix = '';
      whiteList.forEach((c) => {
        whiteListRegix += `${c}|`;
      });

      let promises = [];

      content.forEach((el) => {
        // replace and split into chunks
        const chunks = el.message.replace(new RegExp(whiteListRegix, 'g'), '').match(/.{1,279}/g);
        let witPromises = [];
        chunks.forEach((chunk) => witPromises.push(wit.messageWit({ expression: chunk })));

        promises.push(
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve, reject) => {
            try {
              witPromises = await Promise.all(witPromises);
              let haveBadWords = false;
              witPromises.forEach((wP) => {
                // eslint-disable-next-line no-bitwise
                haveBadWords
                  |= wP.entities
                  && wP.entities.intent
                  && wP.entities.intent.some((i) => !i.suggested && i.confidence === 1);
              });
              // eslint-disable-next-line no-unused-expressions
              haveBadWords ? resolve(true) : resolve(false);
            } catch (error) {
              reject(error);
            }
          }),
        );
      });

      promises = await Promise.all(promises);

      const savePromises = [];
      content.forEach((c, ind) => {
        const status = promises[ind] ? 'bad' : 'clean';
        savePromises.push(contentModel.findByIdAndUpdate(c._id, { status }));
      });
      await Promise.all(savePromises);
      console.log('repeatedly analysis ===> done');
      return true;
    } catch (error) {
      console.log('something went wrong while repeatedly analysis: ', error);
      return false;
    }
  }
}

module.exports = witAnalyzer;
