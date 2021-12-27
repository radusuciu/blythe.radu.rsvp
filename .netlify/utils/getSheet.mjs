import { GoogleSpreadsheet } from 'google-spreadsheet'


export async function getSheet(sheetName) {
    const doc = new GoogleSpreadsheet(process.env.INVITE_SHEET_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    return doc.sheetsByTitle[sheetName]
}
