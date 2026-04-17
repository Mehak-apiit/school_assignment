const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database Initialization
 * Automatically creates database and tables if they don't exist
 */

/**
 * Initialize database and tables
 */
async function initializeDatabase() {
  try {
    // Create connection without specifying database (to create it if needed)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'
    });

    console.log('Connected to MySQL server');

    // Get database name from environment
    const dbName = process.env.DB_NAME || 'school_management';

    // Check if database exists
    const [databases] = await connection.execute(
      `SHOW DATABASES LIKE '${dbName}'`
    );

    if (databases.length === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      await connection.execute(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }

    // Close the initial connection and reconnect to the specific database
    await connection.end();

    // Connect to the specific database
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: dbName
    });

    console.log(`Connected to database '${dbName}'`);

    // Check if schools table exists
    const [tables] = await dbConnection.execute(
      "SHOW TABLES LIKE 'schools'"
    );

    if (tables.length === 0) {
      console.log("Table 'schools' does not exist. Creating...");
      await createSchoolsTable(dbConnection);
      console.log("Table 'schools' created successfully");
    } else {
      console.log("Table 'schools' already exists");
    }

    await dbConnection.end();
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

/**
 * Create schools table
 */
async function createSchoolsTable(connection) {
  const createTableSQL = `
    CREATE TABLE schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_latitude (latitude),
      INDEX idx_longitude (longitude)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await connection.execute(createTableSQL);
}

module.exports = {
  initializeDatabase
};
