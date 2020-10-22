const SequelizeAuto = require('sequelize-auto')
const Sequelize = require('sequelize')
const { modules: { orm: { config: { uri } } } } = require('./config')

const sequelize = new Sequelize(uri)
const options = {
  directory: './model',
  caseFile: 'l',
  caseModel: 'p',
  caseProp: 'c'
}

const auto = new SequelizeAuto(sequelize, null, null, options)
auto.run().then(data => {
  console.log(data.tables) // table list
  console.log(data.foreignKeys) // foreign key list
  console.log(data.text) // text of generated files
})
