module.exports = {
  lng: 'zh_CN',
  modules: {
    orm: {
      module: 'jm-server-middleware',
      jsonpath: '$.sequelize',
      config: {
        dir: `${__dirname}/../model`,
        uri: 'mysql://root:123@mysql.l.jamma.cn/main', // A full database URI;
        options: {
          define: {
            freezeTableName: true, // 模型名作为表名
            underscored: true // 采用下划线字段名
          }
        }
      }
    },
    hello: {},
    main: {},
    main2: {},
    decorate: {}
  }
}
