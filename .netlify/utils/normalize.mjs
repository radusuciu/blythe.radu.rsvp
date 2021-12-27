import deburr from 'lodash/deburr.js'


export function normalize(text) {
    return deburr(text.toLowerCase().trim().replace(/\s+/, ' '))
}
