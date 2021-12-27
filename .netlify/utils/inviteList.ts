import { GoogleSpreadsheet } from 'google-spreadsheet'
import { getSheet } from './getSheet.mjs'
const fs = require('fs')

const INVITEES_JSON_PATH = '.netlify/data/invitees.json'
const INVITE_LIST_SHEET_TITLE = 'Invite List'


async function generateInvitees() {
    const sheet = await getSheet(INVITE_LIST_SHEET_TITLE)
    const rows = await sheet.getRows()

    const invitees = rows.map((row) => {
        return {
            id: row.id,
            name: `${row.firstName} ${row.lastName}`,
            partyName: row.partyName,
            hasPlusOne: row.hasPlusOne,
        }
    })
    console.log('got invitees')

    fs.writeFileSync(INVITEES_JSON_PATH, JSON.stringify(invitees))
}


export async function getInvitees() {
    if (!fs.existsSync(INVITEES_JSON_PATH)) {
        console.log('invitees.json does not exist')
        await generateInvitees()
    }

    // return require(INVITEES_JSON_PATH)
    console.log('invitees.json hopefully exists now')
    return JSON.parse(fs.readFileSync(INVITEES_JSON_PATH, 'utf-8'))
}
