import dotenv from 'dotenv';
import path from 'path';
import { getEnvironmentVariable } from '../helpers/EnvironmentVariables';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

interface EnvironmentVariables {
  API_URL: string;
  USER_NAME: string;
  GOOGLE_CREDENTIALS_PATH: string;
  GOOGLE_SPREADSHEET_ID: string;
  GOOGLE_SHEET_ID: string;
}

export const ENV: EnvironmentVariables = {
  API_URL: getEnvironmentVariable('API_URL'),
  USER_NAME: getEnvironmentVariable('USER_NAME'),
  GOOGLE_CREDENTIALS_PATH: getEnvironmentVariable('GOOGLE_CREDENTIALS_PATH'),
  GOOGLE_SPREADSHEET_ID: getEnvironmentVariable('GOOGLE_SPREADSHEET_ID'),
  GOOGLE_SHEET_ID: getEnvironmentVariable('GOOGLE_SHEET_ID'),
} as const;
