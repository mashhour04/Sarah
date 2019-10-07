const { contentModel, keywordsModel } = require('../../model');

const getContentSymbol = Symbol('getContentSymbol');
const getGoodKeywordSymbol = Symbol('getGoodKeywordSymbol');

class witAnalyzer {
  async [getContentSymbol]() {
    try {
      const pendingContent = await contentModel
        .find({ status: 'pending' })
        .select('message status');
      return pendingContent;
    } catch (error) {
      return false;
    }
  }

  async [getGoodKeywordSymbol]() {
    try {
      const whiteList = await keywordsModel.find({ type: 'good' }).select('keyword type');
      return whiteList;
    } catch (error) {
      return false;
    }
  }

  static async analysis() {
    try {
      const content = await this[getContentSymbol]();
      const whiteList = await this[getGoodKeywordSymbol]();

      content.forEach((el) => {});
    } catch (error) {
      console.log('something went wrong while repeatedly analysis: ', error);
    }
  }
}

module.exports = witAnalyzer;
