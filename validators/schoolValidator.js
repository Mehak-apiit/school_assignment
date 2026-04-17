/**
 * Validator utilities for school-related operations
 */

/**
 * Validate school data for adding a new school
 * @param {Object} data - School data to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateSchoolData(data) {
  const errors = [];
  const { name, address, latitude, longitude } = data;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('School name is required and must be a non-empty string');
  }

  // Validate address
  if (!address || typeof address !== 'string' || address.trim() === '') {
    errors.push('Address is required and must be a non-empty string');
  }

  // Validate latitude
  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('Latitude is required');
  } else {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a number between -90 and 90');
    }
  }

  // Validate longitude
  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('Longitude is required');
  } else {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Longitude must be a number between -180 and 180');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate coordinates for listing schools
 * @param {Object} params - Query parameters
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateCoordinates(params) {
  const errors = [];
  const { latitude, longitude } = params;

  // Validate latitude
  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('Latitude parameter is required');
  } else {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a number between -90 and 90');
    }
  }

  // Validate longitude
  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('Longitude parameter is required');
  } else {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Longitude must be a number between -180 and 180');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateSchoolData,
  validateCoordinates
};
