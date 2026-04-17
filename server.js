const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const schoolRoutes = require('./routes/schoolRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { initializeDatabase } = require('./config/db-init');

const app = express();
const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Routes
app.use(schoolRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'School Management API',
    version: '1.0.0',
    architecture: 'Layered Architecture (Repository Pattern)',
    endpoints: {
      'POST /addSchool': 'Add a new school',
      'GET /listSchools': 'List all schools sorted by proximity to user location'
    }
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Try to initialize database and tables (optional)
    try {
      await initializeDatabase();
    } catch (dbError) {
      console.warn('Warning: Database initialization failed. Server will start but database operations may fail.');
      console.warn('Make sure MySQL is running and credentials are correct in .env file.');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints:`);
      console.log(`  POST   http://localhost:${PORT}/addSchool`);
      console.log(`  GET    http://localhost:${PORT}/listSchools`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
