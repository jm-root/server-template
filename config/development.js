module.exports = {
  debug: true,
  port: 3000,
  gateway: 'http://gateway.test.jamma.cn',
  modules: {
    orm: {
      config: {
        uri: 'mysql://root:123@localhost/main', // A full database URI;
      }
    }
  }
}
