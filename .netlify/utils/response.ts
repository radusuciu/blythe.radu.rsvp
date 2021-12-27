export function response(payload: object, statusCode: number = 200) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        }
    }
}

export function errorResponse(message: string, statusCode: number = 400) {
    return response({ error: message }, statusCode)
}
