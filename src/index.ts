import ApiClient from './api/ApiClient';
import { ENV } from './configs/Env';

async function main() {
  const apiClient = new ApiClient(ENV.API_URL);

  try {
    await apiClient.authorize(ENV.USER_NAME);
  } catch (error) {
    console.log(`API authorization failed: ${error}`);
    return;
  }

  console.log('API client successfully created.');
}

main();
