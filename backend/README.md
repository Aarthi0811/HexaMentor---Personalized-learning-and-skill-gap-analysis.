# Secure Backend Application

This project is a secure backend application built with Node.js, Express.js, and MongoDB. It implements JWT authentication and uses bcrypt for password hashing.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- MongoDB for data storage

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt
- JSON Web Tokens (JWT)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd secure-backend-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in `src/config/db.js`.

## Usage

1. Start the application:
   ```
   npm start
   ```

2. The server will run on `http://localhost:3000`.

## API Endpoints

### Register

- **POST** `/api/auth/register`
- Request body: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Login

- **POST** `/api/auth/login`
- Request body: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

## License

This project is licensed under the MIT License.