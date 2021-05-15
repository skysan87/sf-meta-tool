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
        api_name: f.fullName,
        label: f.label,
        type: f.type,
      })

      // pickup list
      if (f.hasOwnProperty('valueSet')) {
        field.valueset = f.valueSet.valueSetDefinition.value
          .map((list) => list.label)
          .join(';')
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
