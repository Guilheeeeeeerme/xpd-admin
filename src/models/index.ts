'use strict';

import fs = require('fs');
import path = require('path');
import Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db: any = {};

const config = {
  username: 'postgres',
  password: 'postgres',
  database: 'xpd',
  host: '200.235.79.179',
  dialect: 'postgres',
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
	const model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
	db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
