# INIT 3.0

## About

INIT 3.0 is a contest manager designed to efficiently handle all national contests under a single framework for the Notre Dame Information Technology Club of Bangladesh. It provides a streamlined solution for managing participants, contests, and administrative tasks.

## Features

1. Participant Registration and Profile system.
2. Automated Contest form creation system.
3. A content management system in the admin panel.
4. File Uploading system.
5. Email and SMS sending system.
6. QR code verification system.
7. Team creation system.

## Project File Structure

```
init3.0/
├── client/          # Frontend application
│   ├── src/         # Source code for the client
│   ├── public/      # Public assets
│   └── package.json # Client dependencies
├── server/          # Backend application
│   ├── src/         # Source code for the server
│   ├── config/      # Configuration files
│   ├── ...          # other files
│   └── package.json # Server dependencies
├── .env.example     # Environment variable template
├── README.md        # Project documentation
└── LICENSE          # License file
```

## Setup Instructions

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or higher)
- npm
- MySQL (for database)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd init3.0
   ```

2. Install dependencies for both client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Create a `.env` file in the `server` directory using the provided `.env.example` template.

4. Start the development servers:

   - For the client:
     ```bash
     cd client
     npm start
     ```
   - For the server:
     ```bash
     cd server
     npm run dev
     ```

5. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8001`

### `.env` Template

Create a `.env` file in the `server` directory with the following structure:

```
# filepath: init3.0\server\.env.example
NODE_ENV= dev_env
SALT= numeric_value
ADMIN_SECRET= random_letters
CLIENT_SECRET= random_letters
QR_SECRET= random_letters
SERVER_EMAIL= mail_id
MAIL_PASS= mail_pass
MAIL_HOST= mail_host
SMS_USERNAME= bulksmsbd_username
SMS_PASS= bulksmsbd_password
REMOTE_CLIENT_APP= http://localhost:3000,http://localhost:3001,http://localhost:8001
DB_USER= database_username
DB_PASS= database_user_pass
DB_NAME= database_name
DB_HOST= database_hose
```

Replace the placeholder values with your actual configuration.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
