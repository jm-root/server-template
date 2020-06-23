module.exports = {
  lng: 'zh_CN',
  modules: {
    orm: {
      module: 'jm-server-middleware',
      jsonpath: '$.sequelize',
      config: {
        uri: 'mysql://root:123@mysql.l.jamma.cn/main' // A full database URI;
      }
    },
    hello: {},
    main: {},
    decorate: {}
  }
}
