const jsforce = require('jsforce')
const config = require('config')
const SaveMetadataTask = require('./task/SaveMetadataTask')

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
    // Get Metadata
    await conn.login(USER, PASSWORD + SECURITY_TOKEN)

    // NOTE: care about "Metadata limits for the Metadata API"
    const metadatas = await conn.metadata.read('CustomObject', ['Account'])

    metadatas.forEach(async (meta) => {
      await SaveMetadataTask.run(meta)
    })

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
