const express = require('express');
const router = express.Router();
const {
  addSchool,
  listSchools
} = require('../controllers/schoolController');
const { validateSchoolData, validateCoordinates } = require('../validators/schoolValidator');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Middleware to validate school data
 */
const validateAddSchool = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;
  const validation = validateSchoolData({ name, address, latitude, longitude });
  
  if (!validation.isValid) {
    throw new AppError(validation.errors[0], 400);
  }
  
  next();
};

/**
 * Middleware to validate coordinates
 */
const validateListSchools = (req, res, next) => {
  const { latitude, longitude } = req.query;
  const validation = validateCoordinates({ latitude, longitude });
  
  if (!validation.isValid) {
    throw new AppError(validation.errors[0], 400);
  }
  
  next();
};

/**
 * @route   POST /addSchool
 * @desc    Add a new school
 * @access  Public
 */
router.post('/addSchool', validateAddSchool, addSchool);

/**
 * @route   GET /listSchools
 * @desc    List all schools sorted by proximity to user location
 * @access  Public
 * @query   latitude - User's latitude coordinate (required)
 * @query   longitude - User's longitude coordinate (required)
 */
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
