const schoolService = require('../services/schoolService');

/**
 * Add School Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Call service layer
    const school = await schoolService.addSchool({ name, address, latitude, longitude });

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: school
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List Schools Controller - sorted by proximity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const listSchools = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    // Parse coordinates
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    // Call service layer
    const schools = await schoolService.listSchoolsByProximity(userLatitude, userLongitude);

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSchool,
  listSchools
};
