const axios = require('axios');

const BASE_URL = 'http://localhost:4001';

/**
 * API Test Suite for School Management API
 * Tests the two required endpoints:
 * - POST /addSchool
 * - GET /listSchools
 */

// Test data
const testSchools = [
  {
    name: 'ABC High School',
    address: '123 Main Street, New Delhi',
    latitude: 28.6139,
    longitude: 77.2090
  },
  {
    name: 'XYZ International School',
    address: '456 Park Avenue, New Delhi',
    latitude: 28.6200,
    longitude: 77.2100
  },
  {
    name: 'Gurgaon Public School',
    address: '789 Elite Road, Gurgaon',
    latitude: 28.4500,
    longitude: 77.0500
  }
];

/**
 * Test POST /addSchool endpoint
 */
async function testAddSchool() {
  console.log('\n=== Testing POST /addSchool ===');
  
  try {
    // Test valid school data
    console.log('\n1. Testing with valid school data...');
    const response = await axios.post(`${BASE_URL}/addSchool`, testSchools[0]);
    console.log('✓ Success:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.log('✗ Error:', error.response?.data || error.message);
  }

  try {
    // Test missing name
    console.log('\n2. Testing with missing name...');
    const response = await axios.post(`${BASE_URL}/addSchool`, {
      address: '123 Street',
      latitude: 28.6139,
      longitude: 77.2090
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }

  try {
    // Test invalid latitude
    console.log('\n3. Testing with invalid latitude...');
    const response = await axios.post(`${BASE_URL}/addSchool`, {
      name: 'Test School',
      address: '123 Street',
      latitude: 95.0,
      longitude: 77.2090
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }

  try {
    // Test invalid longitude
    console.log('\n4. Testing with invalid longitude...');
    const response = await axios.post(`${BASE_URL}/addSchool`, {
      name: 'Test School',
      address: '123 Street',
      latitude: 28.6139,
      longitude: 200.0
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }
}

/**
 * Test GET /listSchools endpoint
 */
async function testListSchools() {
  console.log('\n=== Testing GET /listSchools ===');
  
  try {
    // Test with valid coordinates
    console.log('\n1. Testing with valid coordinates...');
    const response = await axios.get(`${BASE_URL}/listSchools`, {
      params: {
        latitude: 28.6139,
        longitude: 77.2090
      }
    });
    console.log('✓ Success:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.log('✗ Error:', error.response?.data || error.message);
  }

  try {
    // Test missing latitude
    console.log('\n2. Testing with missing latitude...');
    const response = await axios.get(`${BASE_URL}/listSchools`, {
      params: {
        longitude: 77.2090
      }
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }

  try {
    // Test missing longitude
    console.log('\n3. Testing with missing longitude...');
    const response = await axios.get(`${BASE_URL}/listSchools`, {
      params: {
        latitude: 28.6139
      }
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }

  try {
    // Test invalid latitude
    console.log('\n4. Testing with invalid latitude...');
    const response = await axios.get(`${BASE_URL}/listSchools`, {
      params: {
        latitude: 95.0,
        longitude: 77.2090
      }
    });
    console.log('✗ Should have failed but succeeded');
  } catch (error) {
    console.log('✓ Expected error:', error.response?.data || error.message);
  }
}

/**
 * Test health check endpoint
 */
async function testHealthCheck() {
  console.log('\n=== Testing GET / (Health Check) ===');
  
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✓ Success:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.log('✗ Error:', error.response?.data || error.message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('========================================');
  console.log('School Management API Test Suite');
  console.log('========================================');
  
  await testHealthCheck();
  await testAddSchool();
  await testListSchools();
  
  console.log('\n========================================');
  console.log('Test Suite Completed');
  console.log('========================================');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAddSchool,
  testListSchools,
  testHealthCheck,
  runTests
};
