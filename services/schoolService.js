const schoolRepository = require('../repositories/schoolRepository');
const { calculateDistance } = require('../utils/distanceUtils');
const { AppError } = require('../middlewares/errorHandler');

/**
 * School Service - Handles business logic for school operations
 */
class SchoolService {
  /**
   * Add a new school with validation
   * @param {Object} schoolData - School data
   * @returns {Promise<Object>} Created school
   */
  async addSchool(schoolData) {
    try {
      // Trim string values
      const sanitizedData = {
        name: schoolData.name.trim(),
        address: schoolData.address.trim(),
        latitude: parseFloat(schoolData.latitude),
        longitude: parseFloat(schoolData.longitude)
      };

      // Create school in database
      const school = await schoolRepository.create(sanitizedData);
      return school;
    } catch (error) {
      throw new AppError('Failed to add school', 500);
    }
  }

  /**
   * Get all schools sorted by proximity to user's location
   * @param {number} userLatitude - User's latitude
   * @param {number} userLongitude - User's longitude
   * @returns {Promise<Array>} Array of schools with distance
   */
  async listSchoolsByProximity(userLatitude, userLongitude) {
    try {
      // Fetch all schools from database
      const schools = await schoolRepository.findAll();

      // Calculate distance for each school
      const schoolsWithDistance = schools.map(school => {
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          school.latitude,
          school.longitude
        );
        return {
          ...school,
          distance: parseFloat(distance.toFixed(2))
        };
      });

      // Sort by distance (ascending)
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      return schoolsWithDistance;
    } catch (error) {
      throw new AppError('Failed to fetch schools', 500);
    }
  }
}

module.exports = new SchoolService();
