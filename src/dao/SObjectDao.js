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

  static async save(sObjects) {
    const db = DB.get()
    return new Promise((resolve, reject) => {
      try {
        const data = sObjects.map(v => {
          return [
            v.api_name,
            v.label,
            v.type,
            v.valueset
          ]
        })

        const placeholder = data.reduce((pre, value, index) => {
          if (index > 0) {
            pre += ','
          }
          return pre += `(?${', ?'.repeat(value.length - 1)})`
        }, '')

        db.all(`INSERT INTO ${TABLE_NAME}
          (api_name, label, type, valueset)
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