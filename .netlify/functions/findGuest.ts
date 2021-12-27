import { Handler } from '@netlify/functions'
import { Guest } from '../../src/api/guest'
import { response, errorResponse } from '../utils/response'
import invitees from '../data/invitees.json'
import { normalize } from '../utils/normalize.mjs'
import * as fuzzball from 'fuzzball'


// TODO: check if all of the matches have identical names
// and if they do, we should handle that.. we need a disambiguation
// field in the data to support this

// TODO: do something when user says they are not the person

const GOOD_SCORE_THRESHOLD = 85
const PERFECT_SCORE = 100
const NAME_MATCH_SCORE_THRESHOLD = 65
const FUZZY_SCORER = fuzzball.partial_token_similarity_sort_ratio


interface JSONGuest extends Guest {
    middleName: string,
    fullFirstName: string,
    fullName: string,
    normalized: {
        firstName: string
        fullFirstName: string
        middleName: string
        lastName: string
        name: string
        fullName: string
    }
}


function matchGuestsByNameStartingWith(name: string): { firstName: boolean, lastName: boolean, matches: JSONGuest[] } {
    const firstNameMatches = invitees.filter(i => {
        return (
            i.normalized.firstName.startsWith(name) ||
            i.normalized.fullFirstName.startsWith(name)
        )
    })

    const lastNameMatches = invitees
        .filter(i => i.normalized.lastName.split(' ').some(
            n => n.startsWith(name)
        ))

    return {
        firstName: firstNameMatches.length === 1,
        lastName: lastNameMatches.length === 1,
        matches: [ ...firstNameMatches, ...lastNameMatches ],
    }
}

function getUniqueMatch(name: string): Guest | undefined {
    const matches = matchGuestsByNameStartingWith(name)
 
    // if it's a unique first or last name
    if (matches.matches.length === 1 && (
            (matches.firstName && !matches.lastName) ||
            (!matches.firstName && matches.lastName)
        )
    ) {
        return matches.matches[0]
    }
}

function getTwoWordMatch(w1: string, w2: string): JSONGuest[] {
    // TODO. filter exact matches that have other names starting with that name
    // eg. we can get an exact match on "Mihai" 
    return invitees.filter(i => {
        const firstName = i.normalized.firstName
        const fullFirstName = i.normalized.fullFirstName
        const lastName = i.normalized.lastName

        const firstNameMatchesW1 = firstName.startsWith(w1) || fullFirstName.startsWith(w1)
        const firstNameMatchesW2 = firstName.startsWith(w2) || fullFirstName.startsWith(w2)
        // TODO: consider doing this with .some() to support multiple last names
        const lastNameMatchesW1 = lastName.startsWith(w1)
        const lastNameMatchesW2 = lastName.startsWith(w2)

        return (
            (firstNameMatchesW1 && lastName.startsWith(w2) || firstNameMatchesW2 && lastName.startsWith(w1)) ||
            (lastNameMatchesW1 && firstName.startsWith(w2) || lastNameMatchesW2 && firstName.startsWith(w1))
        )
    })
}

function getFuzzyMatch(name: string, scoreThreshold: number) {
    const fuzzyMatches = fuzzball.extract(name, invitees, {
        scorer: FUZZY_SCORER,
        processor: choice => choice.fullName,
        cutoff: 50,
        returnObjects: true,
        useCollator: true,
    })

    let goodMatches = fuzzyMatches.filter(m => m.score >= scoreThreshold)

    if (goodMatches.length > 1) {
        const perfectMatches = goodMatches.filter(m => m.score === PERFECT_SCORE)
        if (perfectMatches.length === 1) {
            goodMatches = [perfectMatches[0]]
        }
    }

    return goodMatches
}

function findGuest(name: string): [JSONGuest[], boolean] {
    const words = name.split(' ')
    let guestsByName: JSONGuest[] = []
    let keepTyping = false

    if (words.length === 1) {
        // guestsByName = [getUniqueMatch(words[0])]
        const matches = matchGuestsByNameStartingWith(words[0])
        guestsByName = matches.matches

        keepTyping = !(matches.matches.length === 1 && (
            (matches.firstName && !matches.lastName) ||
            (!matches.firstName && matches.lastName)
        ))
    // } else if (words.length === 2 && words[0].length > 1 && words[1].length > 1) {
    } else if (words.length === 2) {
        guestsByName = getTwoWordMatch(words[0], words[1])
    }

    // filtering undefined values out
    guestsByName = guestsByName.filter(g => g)
    guestsByName = guestsByName.filter(g => FUZZY_SCORER(name, g.normalized.fullName) >= NAME_MATCH_SCORE_THRESHOLD)

    if (guestsByName.length === 1) {
        return [guestsByName, false]
    } else if (guestsByName.length > 1 && words.length === 1) {
        return [guestsByName, true]
    } else if (guestsByName.length > 1 && words.length === 2) {
        return [guestsByName, !(words[0].length > 2 && words[1].length > 2)]
    } else {
        const fuzzyMatches = getFuzzyMatch(name, 55)
        const goodMatches = fuzzyMatches.filter(m => m.score >= GOOD_SCORE_THRESHOLD)
    
        if (goodMatches.length) {
            return [goodMatches.map(m => m.choice), false]
        } else if (fuzzyMatches.length) {
            return [[], true]
        } else {
            return [[], false]
        }
    }
}

function guestFromJson(jsonGuest: JSONGuest): Guest {
    return {
        id: jsonGuest.id,
        name: jsonGuest.name,
        partyName: jsonGuest.partyName,
        party: jsonGuest.party,
        hasPlusOne: jsonGuest.hasPlusOne,
    }
}


const handler: Handler = async (event, context) => {
    const query: string = event.queryStringParameters?.query.trim()

    if (!query) {
        return errorResponse('Query must be provided')
    }

    const normalizedQuery = normalize(query)
    const words = query.split(' ')

    let [matches, keepTyping] = findGuest(normalizedQuery)

    // TODO handle cases where all matches are equal?
    // this may be better to do on the client-side?
    if (matches.length === 1) {
        return response({
            guest: guestFromJson(matches[0]),
            uniqueMatch: true,
        })
    } else if (matches.length > 1 && keepTyping) {
        matches = []
    } else if (matches.length === 0 && !keepTyping && words.length > 1) {
        // TODO: revisit this.. maybe we can do a second search 
        // with a looser requirement
        return errorResponse('Guest not found', 404)
    }

    return response({
        uniqueMatch: false,
        matches: matches.map(m => guestFromJson(m)),
    })
}

export { handler };
