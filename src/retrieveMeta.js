const jsforce = require('jsforce')
const SObjectDao = require('./dao/SObjectDao')
const DB = require('./dao/DB')
const SObjectField = require('./entity/SObjectField')

const SANDBOX_CON = { loginUrl: 'https://test.salesforce.com' }

/* === SET LOGIN INFOMATION === */
const USER = ''
const PASSWORD = ''
const SECURITY_TOKEN = ''
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

    metadata.fields.forEach(async (f) => {
      const field = new SObjectField({
        api_name: f.fullName,
        label: f.label,
        type: f.type,
      })

      // pickup list
      if (f.hasOwnProperty('valueSet')) {
        field.valuset = f.valueSet.valueSetDefinition.value
          .map((list) => list.label)
          .join(',')
      }

      // save to db
      await SObjectDao.save(field)
    })

    await conn.logout()
  } catch (error) {
    console.error(error)
  }
}

main()
