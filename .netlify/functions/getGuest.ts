import { Handler } from '@netlify/functions'
import { Guest } from '../../src/api/guest'
import { response, errorResponse } from '../utils/response'
import invitees = require('../data/invitees.json')

const handler: Handler = async (event, context) => {
    const guestId: string = event.queryStringParameters?.guestId

    if (!guestId) {
        return errorResponse('Guest ID must be provided')
    }

    const guest: Guest = invitees.find(i => i.id === guestId)

    if (!guest) {
        return errorResponse('Guest not found', 404)
    }

    return response(guest)
}

export { handler };
