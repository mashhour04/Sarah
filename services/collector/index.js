const Test = require('./test');

Test.getPosts().then(res => {
    console.log('posts response', res)
}).catch(err => {
    console.log('error getting posts', err.message)
})
module.exports = { 
    Test
}