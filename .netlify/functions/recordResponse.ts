import { Handler } from '@netlify/functions'
import { response, errorResponse } from '../utils/response'
import { getSheet } from '../utils/getSheet.mjs'
import invitees = require('../data/invitees.json')

const handler: Handler = async (event, context) => {
    const responsesRaw = JSON.parse(event.body)
    const date = new Date()
    const responses = responsesRaw.map(r => {
        r.date = date.toISOString()
        return r
    })

    const sheet = await getSheet('Responses Log')
    const addedRows = await sheet.addRows(responses)

    return response({
        message: 'Hello world!',
    })
}

export { handler };