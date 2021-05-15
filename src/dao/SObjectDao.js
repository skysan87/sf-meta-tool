const DB = require('./DB')

const TABLE_NAME = 'sobject'

class SObjectDao {

  static async createTableIfNotExists() {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${TABLE_NAME} (
            object_api text
            , object_label text
            , field_api text
            , field_label text
            , field_type text
            , valueset text
            , formula text
            , is_custom boolean
          )`)
        })
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }

  static async save(sObjects) {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        const data = sObjects.map(v => {
          return [
            v.object_api,
            v.object_label,
            v.field_api,
            v.field_label,
            v.field_type,
            v.valueset,
            v.formula,
            v.isCustom
          ]
        })

        const placeholder = data.reduce((pre, value, index) => {
          if (index > 0) {
            pre += ','
          }
          return pre += `(?${', ?'.repeat(value.length - 1)})`
        }, '')

        db.all(`INSERT INTO ${TABLE_NAME}
          (object_api, object_label, field_api, field_label, field_type, valueset, formula, is_custom)
          VALUES ${placeholder}`,
          data.flat()
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
        db.run(`DROP TABLE IF EXISTS ${TABLE_NAME}`)
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }
}

module.exports = SObjectDao