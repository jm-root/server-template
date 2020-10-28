module.exports = {
  lng: 'zh_CN',
  modules: {
    orm: {
      module: 'jm-server-middleware',
      jsonpath: '$.sequelize',
      config: {
        dir: `${__dirname}/../model`,
        uri: 'mysql://root:123@mysql.l.jamma.cn/main' // A full database URI;
      }
    },
    hello: {},
    main: {},
    decorate: {}
  }
}
