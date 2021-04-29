const DB = require('./DB')

const TABLE_NAME = 'sobject'

class SObjectDao {

  static async createTableIfNotExists() {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${TABLE_NAME} (
            api_name text
            , label text
            , type text
            , valueset text
          )`)
        })
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }

  static async save(sObject) {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        db.run(`insert into ${TABLE_NAME}
          (api_name, label, type, valueset)
          values ($api_name, $label, $type, $valueset)`,
          sObject.api_name,
          sObject.label,
          sObject.type,
          sObject.valueset
        )
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }

  static async drop() {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        db.run(`DROP TABLE ${TABLE_NAME}`)
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }
}

module.exports = SObjectDao