module.exports = {
  gateway: 'gateway',
  redis: 'redis',
  mysql: 'mysql',
  service_name: 'service_name',
  modules: {
    'jm-server-jaeger': {
      config: {
        jaeger: 'jaeger'
      }
    },
    orm: {
      config: {
        uri: 'orm_uri'

      }
    }
  }
}
