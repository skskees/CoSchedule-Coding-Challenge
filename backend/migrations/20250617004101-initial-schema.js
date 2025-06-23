'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    username: {type: 'string', unique: true, notNull: true},
    email: {type: 'string'},
    password_has: {type: 'string', notNull: true},
    created_at: { type: 'datetime', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')}
  }, createGiphyItems);

  function createGiphyItems(err){
    if (err) return callback(err);
    db.createTable('giphy_items', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      giphy_id: {type: 'int', unique: true, notNull: true},
      title: {type: 'string'},
      url: {type: 'string'},
      data_blob: {type: 'text'}, //JSON payload
      cached_at: {type: 'datetime', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')}
    }, createRatings);
  }

  function createRatings(err){
    if (err) return callback(err);
    db.createTable('ratings', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      user_id: {type: 'int', notNull: true},
      giphy_id: {type: 'int', notNull: true},
      rating: {type: 'int', notNull: true},
      created_at: { type: 'datetime', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')}
    }, createComments);
  }

  function createComments(err){
    if (err) return callback(err);
    db.createTable('comments', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      user_id: {type: 'int', notNull: true},
      giphy_id: {type: 'int', notNull: true},
      comment: {type: 'string', notNull: true},
      created_at: { type: 'datetime', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')}
    }, addForeignKeys)
  }

  function addForeignKeys(err) {
    if (err) return callback(err);

    db.addForeignKey('ratings', 'users', 'ratings_user_id_fk',
      { 'user_id': 'id' }, { onDelete: 'CASCADE' }, function (err) {
        if (err) return callback(err);
        db.addForeignKey('comments', 'users', 'comments_user_id_fk',
          { 'user_id': 'id' }, { onDelete: 'CASCADE' }, callback);
      });
  }

};

exports.down = function(db) {
  db.dropTable('comments', function() {
    db.dropTable('ratings', function() {
      db.dropTable('giphy_items', function () {
        db.dropTable('users', callback);
      });
    });
  });
};

exports._meta = {
  "version": 1
};
