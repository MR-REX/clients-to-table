# clients-to-table

An extensible and efficient solution for fetching client data and statuses from a
web server API and outputting them to Google Sheets.

**Link to the generated Google Sheets spreadsheet:**

[Generated Google Sheets Spreadsheet](https://docs.google.com/spreadsheets/d/1MoLDG4CoajnYEx_M4vD-gwwPW3VeSmZ3Jb8jhOmow5Y/edit?usp=sharing)

> [!WARNING]
> All data provided in this project, including client information in the table, is
**not real** and is for **demonstration purposes only**. The data has been generated for testing and development and should not be considered valid or used
for any production purposes. Any similarities to real persons or entities are purely
**coincidental**.

## About

This project is a **test assignment** for a Backend (NodeJS) Developer position.
It demonstrates the ability to interact with APIs, handle data processing, and
integrate with external services like Google Sheets.

The primary goals of this project is:
1. Retrieve client data (including statuses) from a web server via an API.
2. Process and format the data as needed.
3. Output the data into a structured table in Google Sheets.

## Features

- **API Integration:** Fetch clients information with API authentication.
- **Data Transformation:** Parse, validate, and format data for seamless output.
- **Google Sheets Export:** Automatically populate a Google Sheet with the retrieved client data.
- **Chunk Handling:** Supports large datasets by splitting them into manageable chunks.
- **Error Handling:** Resilient against API or network issues.

## Requirements

- Node.js
- A Google Cloud project with Sheets API enabled
- Service account credentials for Google Sheets
- A valid API endpoints (`GET /clients` & `POST /clients`) for fetching client data

## Dependencies

### Development Dependencies
- **eslint**: A powerful linting tool to enforce consistent code style and catch potential errors during development.
- **prettier**: An opinionated code formatter that ensures uniform code formatting across the project.
- **typescript**: Provides static typing for JavaScript, improving code readability, safety, and developer productivity.

### Runtime Dependencies
- **axios**: A lightweight HTTP client for making API requests, with built-in support for promises and error handling.
- **dotenv**: Enables the use of environment variables from a `.env` file to manage sensitive configurations securely.
- **googleapis**: A client library for interacting with Google APIs, used here for integrating with Google Sheets.
- **jose**: A modern library for handling JSON Web Tokens (JWT) and cryptographic operations, ensuring secure authentication and API access.
- **zod**: A TypeScript-first schema validation library for validating and parsing API responses and ensuring data integrity.

### Required Configurations

1. **`credentials.json`**:  
A Google service account credentials file is needed to authenticate the application with Google Sheets.
You can generate this file in the [Google Cloud Console](https://console.cloud.google.com):
    - Create or select a project.
    - Enable the Google Sheets API.
    - Create a service account and download the credentials as a JSON file.
    - Place the downloaded file as `credentials.json` in the root directory of the project.

2. **Environment Variables**:  
The project relies on properly configured environment variables to function.
These variables must be set in a `.env` file based on the provided example file `.env.example`.
