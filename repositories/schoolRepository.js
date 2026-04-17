const pool = require('../config/db');

/**
 * School Repository - Handles all database operations for schools
 */
class SchoolRepository {
  /**
   * Insert a new school into the database
   * @param {Object} schoolData - School data object
   * @param {string} schoolData.name - School name
   * @param {string} schoolData.address - School address
   * @param {number} schoolData.latitude - School latitude
   * @param {number} schoolData.longitude - School longitude
   * @returns {Promise<Object>} Created school with ID
   */
  async create(schoolData) {
    const { name, address, latitude, longitude } = schoolData;
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    
    return {
      id: result.insertId,
      name,
      address,
      latitude,
      longitude
    };
  }

  /**
   * Fetch all schools from the database
   * @returns {Promise<Array>} Array of all schools
   */
  async findAll() {
    const [schools] = await pool.execute('SELECT * FROM schools');
    return schools;
  }
}

module.exports = new SchoolRepository();
