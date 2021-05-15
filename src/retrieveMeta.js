const jsforce = require('jsforce')
const SObjectDao = require('./dao/SObjectDao')
const DB = require('./dao/DB')
const SObjectField = require('./entity/SObjectField')
const config = require('config')

const SANDBOX_CON = { loginUrl: 'https://test.salesforce.com' }

/* === SET LOGIN INFOMATION === */
const account = config.get('Account')
const USER = account.user || ''
const PASSWORD = account.password || ''
const SECURITY_TOKEN = account.security_token || ''
/* ============================ */

async function main(sandbox = false) {
  let conn = sandbox
    ? new jsforce.Connection(SANDBOX_CON)
    : new jsforce.Connection()

  try {
    // Refresh DB
    DB.init()
    await SObjectDao.drop()
    await SObjectDao.createTableIfNotExists()

    // Get Metadata
    await conn.login(USER, PASSWORD + SECURITY_TOKEN)

    // NOTE: care about "Metadata limits for the Metadata API"
    const metadata = await conn.metadata.read('CustomObject', 'Account')

    const insertData = []

    metadata.fields.forEach(async (f) => {
      const field = new SObjectField({
        object_api: metadata.fullName,
        object_label: metadata.label,
        field_api: f.fullName,
        field_label: f.label,
        field_type: f.type,
      })

      // picklist
      if (f.hasOwnProperty('valueSet')) {
        field.valueset = f.valueSet.valueSetDefinition.value
          .map((list) => list.label)
          .join(';')
      }

      // lookup
      if (f.type.toLowerCase() === 'lookup') {
        field.field_type = `${f.type}(${f.referenceTo})`
      }

      // formula
      if (f.hasOwnProperty('formula')) {
        field.field_type = `formula(${f.type})`
        field.formula = f.formula
      }

      insertData.push(field)
    })

    // save to db
    await SObjectDao.save(insertData)

  } catch (error) {
    console.error(error)
  } finally {
    try {
      await conn.logout()
    } catch (error) {
      console.error(error)
    }
  }
}

main()
