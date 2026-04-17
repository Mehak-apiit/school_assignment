# School Management API

A Node.js REST API for managing school data with MySQL database. The API allows you to add schools and retrieve them sorted by proximity to a user's location. Built using a layered architecture with Repository pattern for better code reusability and maintainability.

## Features

- Add new schools with validation
- List schools sorted by distance from user's location
- MySQL database integration
- Automatic database and table creation on startup
- Input validation for coordinates
- Haversine formula for accurate distance calculation
- Layered architecture (Repository Pattern)
- Centralized error handling
- Reusable utilities and validators

## Tech Stack

- Node.js
- Express.js
- MySQL2
- dotenv
- CORS
- Morgan (HTTP request logger)

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)

## Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
   - The application will automatically create the database and tables on startup
   - No manual database setup required

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Edit `.env` with your database credentials:
   ```
   # Environment Configuration
   NODE_ENV=development

   # MySQL Database Configuration
   DB_HOST=localhost
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management

   # Server Configuration
   PORT=4001
   ```

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:4001`

## API Endpoints

### 1. Add School

**Endpoint:** `POST /addSchool`

**Request Body:**
```json
{
  "name": "ABC High School",
  "address": "123 Main Street, City",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `address`: Required, non-empty string
- `latitude`: Required, number between -90 and 90
- `longitude`: Required, number between -180 and 180

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "ABC High School",
    "address": "123 Main Street, City",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "School name is required"
}
```

### 2. List Schools (Sorted by Proximity)

**Endpoint:** `GET /listSchools`

**Query Parameters:**
- `latitude` (required): User's latitude coordinate
- `longitude` (required): User's longitude coordinate

**Example Request:**
```
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Validation Rules:**
- `latitude`: Required, number between -90 and 90
- `longitude`: Required, number between -180 and 180

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "ABC High School",
      "address": "123 Main Street, City",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance": 0.0
    },
    {
      "id": 2,
      "name": "XYZ School",
      "address": "456 Park Avenue, City",
      "latitude": 28.6200,
      "longitude": 77.2100,
      "distance": 0.78
    }
  ]
}
```

**Distance Calculation:**
- Distance is calculated using the Haversine formula
- Distance is returned in kilometers
- Results are sorted by distance (ascending)

## Postman Collection

A Postman collection is included in the project as `postman-collection.json`. Import this file into Postman to test all API endpoints.

### Importing the Collection:

1. Open Postman
2. Click on "Import" in the top left
3. Select the `postman-collection.json` file
4. The collection will be imported and ready to use

### Using the Collection:

1. Set up environment variables in Postman:
   - `base_url`: `http://localhost:4001`

2. Test the endpoints:
   - **Add School**: Send POST request with school data
   - **List Schools**: Send GET request with your coordinates

## Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
node-assignments-2/
├── config/
│   ├── db.js                    # Database connection configuration
│   └── db-init.js               # Database initialization (auto-creates DB and tables)
├── controllers/
│   └── schoolController.js      # HTTP request handlers
├── services/
│   └── schoolService.js         # Business logic layer
├── repositories/
│   └── schoolRepository.js      # Database access layer (Repository Pattern)
├── routes/
│   └── schoolRoutes.js          # API route definitions
├── validators/
│   └── schoolValidator.js      # Input validation utilities
├── middlewares/
│   └── errorHandler.js          # Global error handling middleware
├── utils/
│   └── distanceUtils.js         # Reusable utility functions
├── database/
│   └── schema.sql               # Database schema
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies
├── server.js                    # Main server file
├── README.md                    # This file
└── postman-collection.json      # Postman collection
```

## Architecture Overview

The project follows a **Layered Architecture** with the **Repository Pattern** for better separation of concerns and code reusability:

- **Controllers**: Handle HTTP requests and responses, delegate business logic to services
- **Services**: Contain business logic, coordinate between repositories and utilities
- **Repositories**: Handle all database operations (CRUD)
- **Validators**: Centralized input validation logic
- **Middlewares**: Global error handling and cross-cutting concerns
- **Utils**: Reusable utility functions (e.g., distance calculation)

This architecture provides:
- Better code reusability
- Easier testing and maintenance
- Clear separation of concerns
- Scalable and maintainable codebase

## Error Handling

All endpoints return consistent error responses:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate entry
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: Database connection failed

Example error response:
```json
{
  "success": false,
  "message": "Error description here"
}
```

## Deployment

### Deployment Options:

1. **Heroku**
   - Install Heroku CLI
   - Create a Heroku app
   - Add a MySQL add-on (ClearDB or JawsDB)
   - Set environment variables
   - Deploy using Git

2. **Railway**
   - Connect your GitHub repository
   - Add MySQL service
   - Set environment variables
   - Deploy automatically

3. **Render**
   - Connect your GitHub repository
   - Add PostgreSQL (or use external MySQL)
   - Set environment variables
   - Deploy automatically

4. **VPS (DigitalOcean, AWS, etc.)**
   - Set up a VPS
   - Install Node.js and MySQL
   - Configure environment
   - Use PM2 for process management

### Environment Variables for Production:

Make sure to set the following environment variables in your hosting platform:
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 3306)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `PORT`: Server port (usually provided by the hosting platform)

## License

ISC

## Author

School Management API
"# school_assignment" 
