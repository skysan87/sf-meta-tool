const sqlite3 = require('sqlite3')

let db

class DB {

  static init() {
    const file = 'sf-meta.sqlite'
    db = new sqlite3.Database(file)
  }

  static get() {
    return db
  }
}

module.exports = DB