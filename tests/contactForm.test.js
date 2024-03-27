const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const {Types} = mongoose;

describe('GET /api/v1/contactFormSubmissions/:id', () => {
    it('should return a contact form object for a given id', async () => {
      const contactFormID = '65e5a07ba5fdf325b7fbbe47'; 

      const expectedResult = [{
        _id: contactFormID,
        emailAddress: "aharbisherf@mailsac.com",
        firstName: "Aileen",
        lastName: "Harbisher",
        title: "Where is the hotel?",
        messageBody: "I think I want to register but I want to know where the hotel is first.",
        createdOn: "2024-03-04T10:12:08.903Z",
        __v:0
      }];
  
      const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
      // expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedResult);
    }, 10000);
  
    // hello
    // it('should return a 404 for a form that does not exist', async () => {
    //   const contactFormID = 9999; 
    //   const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
    //   expect(response.statusCode).toBe(404);
    // });

    // testing it out-asjoidjasjdioasjdisa
});


describe('GET /api/v1/contactFormSubmissions', () => {
  it('should return an array of contact forms', async () => {
    const response = await request(app).get(`/api/v1/contactFormSubmissions`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  }, 10000);
});


// Updated not found test
it('should return a 404 for a form that does not exist', async () => {
  // Using a valid format but unlikely to exist ID
  const contactFormID = '507f1f77bcf86cd799439011'; 
  const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
  expect(response.statusCode).toBe(404);
});

// Additional tests
describe('POST /api/v1/submitContactForm', () => {
  it('should handle empty submission', async () => {
    const response = await request(app)
      .post(`/api/v1/submitContactForm`)
      .send({}); // Sending an empty body
    // Assuming your API responds with a 400 status for bad requests
    expect(response.statusCode).toBe(400);
  });

  // Assuming you handle server errors (like database disconnection) with a 500 status
  // This test requires you to mock or force a server error condition, which might be complex
  // So, it's mentioned here for completeness but might not be directly implementable without additional setup
});