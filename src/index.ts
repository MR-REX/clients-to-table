import ApiClient from './api/ApiClient';
import { ENV } from './configs/Env';
import { selectObjectAttributes } from './helpers/Utils';
import GoogleSheetsClient from './utils/GoogleSheetsClient';

const CLIENTS_LIMIT = 5000;
const ROWS_PER_REQUEST = 500;

const CLIENT_ATTRIBUTES = [
  'id',
  'firstName',
  'lastName',
  'gender',
  'address',
  'city',
  'phone',
  'email',
  'status',
];

async function createApiClient(): Promise<ApiClient> {
  const apiClient = new ApiClient(ENV.API_URL);

  try {
    await apiClient.authorize(ENV.USER_NAME);
  } catch (error) {
    let message = '';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.log(`API authorization failed: ${message}`);
  }

  return apiClient;
}

async function processClients(
  apiClient: ApiClient,
  googleSheetsClient: GoogleSheetsClient,
  limit: number,
): Promise<number> {
  let clientsCount = 0;
  const rowsToAppend: unknown[][] = [];

  for await (const clientWithStatus of apiClient.fetchClientsWithStatuses()) {
    const clientAsRow = selectObjectAttributes(clientWithStatus, CLIENT_ATTRIBUTES);
    rowsToAppend.push(clientAsRow);

    clientsCount++;

    const isLimitAchieved = clientsCount >= limit;

    if (rowsToAppend.length >= ROWS_PER_REQUEST || isLimitAchieved) {
      await googleSheetsClient.appendToSheet(
        ENV.GOOGLE_SPREADSHEET_ID,
        ENV.GOOGLE_SHEET_ID,
        rowsToAppend,
      );

      rowsToAppend.length = 0;
    }

    if (isLimitAchieved) {
      break;
    }
  }

  return clientsCount;
}

async function main() {
  const apiClient = await createApiClient();
  console.log('API client successfully initialized.');

  const googleSheetsClient = new GoogleSheetsClient(ENV.GOOGLE_CREDENTIALS_PATH);
  console.log('Google Sheets client successfully initialized.');

  const spreadSheetId = ENV.GOOGLE_SPREADSHEET_ID;
  const sheetId = ENV.GOOGLE_SHEET_ID;

  console.log('Cleanup previous table data...');
  await googleSheetsClient.clearSheet(spreadSheetId, sheetId);

  console.log('Writing table header...');
  await googleSheetsClient.appendToSheet(spreadSheetId, sheetId, [CLIENT_ATTRIBUTES]);

  console.log('Fetching clients data...');
  const processedClientsCount = await processClients(apiClient, googleSheetsClient, CLIENTS_LIMIT);

  console.log(`Success. Processed ${processedClientsCount} clients.`);
}

main();
