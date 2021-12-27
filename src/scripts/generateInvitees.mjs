import { getSheet } from '../../.netlify/utils/getSheet.mjs'
import { normalize } from '../../.netlify/utils/normalize.mjs'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const INVITEES_JSON_PATH = '.netlify/data/invitees.json'
const INVITE_LIST_SHEET_TITLE = 'Invite List'


async function generateInvitees() {
    const sheet = await getSheet(INVITE_LIST_SHEET_TITLE)
    const rows = await sheet.getRows()

    const invitees = rows.map((row) => {
        const name = [row.firstName, row.middleName, row.lastName].filter(n => n).join(' ')
        const fullName = [row.firstName, row.fullFirstName, row.middleName, row.lastName].filter(n => n).join(' ')

        const normalized = {
            firstName: normalize(row.firstName),
            fullFirstName: normalize(row.fullFirstName),
            middleName: normalize(row.middleName),
            lastName: normalize(row.lastName),
            name: normalize(name),
            fullName: normalize(fullName),
        }

        return {
            id: row.id,
            name: name,
            fullName: fullName,
            firstName: row.firstName,
            fullFirstName: row.fullFirstName,
            middleName: row.middleName,
            lastName: row.lastName,
            normalized: normalized,
            partyName: row.partyName,
            hasPlusOne: row.hasPlusOne?.trim().toLowerCase() === 'yes',
        }
    })

    for (const guest in invitees) {
        
    }

    const inviteesWithParty = invitees.map(guest => {
        const party = invitees.filter(i => i.id !== guest.id && i.partyName && i.partyName === guest.partyName)

        const lastNameMatches = invitees.filter(i => {
            return i.normalized.lastName.startsWith(guest.normalized.lastName)
        })

        const firstNameMatches = invitees.filter(i => {
            const guestFirstNames = [guest.normalized.firstName, guest.normalized.fullFirstName].filter(n => n)
            const iFirstNames = [i.normalized.firstName, i.normalized.fullFirstName].filter(n => n)

            return guestFirstNames.some(n => {
                return iFirstNames.some(m => m.startsWith(n))
            })
        })

        const unique = {
            partialFirstName: firstNameMatches.length === 1,
            partialLastName: lastNameMatches.length === 1,
        }

        return {
            ...guest,
            party,
            unique,
        }
    })

    fs.writeFileSync(INVITEES_JSON_PATH, JSON.stringify(inviteesWithParty))
}

generateInvitees()
