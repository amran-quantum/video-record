module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-record/'
    : '/public/index.html',
  css: {
    extract: false
  }
}
