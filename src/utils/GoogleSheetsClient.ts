import { google } from 'googleapis';
import fs from 'node:fs';

export interface Credentials {
  client_email: string;
  private_key: string;
}

export default class GoogleSheetsClient {
  protected readonly client;

  constructor(credentialsPath: string) {
    const credentialsFileContent = fs.readFileSync(credentialsPath, 'utf-8');
    const credentials: Credentials = JSON.parse(credentialsFileContent);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.client = google.sheets({
      version: 'v4',
      auth,
    });
  }

  clearSheet(spreadSheetId: string, range: string) {
    return this.client.spreadsheets.values.clear({
      spreadsheetId: spreadSheetId,
      range,
    });
  }

  appendToSheet(
    spreadSheetId: string,
    range: string,
    values: unknown[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW',
  ) {
    return this.client.spreadsheets.values.append({
      spreadsheetId: spreadSheetId,
      range,
      valueInputOption,
      requestBody: {
        values,
      },
    });
  }
}
