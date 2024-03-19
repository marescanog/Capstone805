const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const {Types} = mongoose;

describe('GET /api/v1/guests/:id', () => {
    it('should return a guest for a given id', async () => {
      const userID = '65edeb166f77f37cbaec2fcc'; 

      const expectedResult = {
        _id: userID,
        emailAddress: "ptume6@mailsac.com",
        // keyWord: "$2a$12$tCu2TInrDf0E/U..7w.96O7XRdi/uPpRAlOTVI6eAlC8etZQXFJFq",
        // keyGen: "NOXEOZTKUL",
        firstName: "Pepi",
        lastName: "Tume",
        mobileNumber: "210-879-2191",
        isVerified: true,
        createdOn: "2023-11-22T03:09:17.489Z",
        address: {
            address: "9575 Merry Drive",
            city: "Cacocum",
            postalCode: "12345",
            country: "Cuba",
            _id: "65edeb166f77f37cbaec2fcd"
        },
        isActive: true,
        reservations: [],
        formSubmissions: [],
        loyaltyHistory: [],
        __v:0
      };
  
      const response = await request(app).get(`/api/v1/guests/${userID}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.guest).toEqual(expectedResult);
    }, 10000);
  
    // it('should return a 404 for a form that does not exist', async () => {
    //   const contactFormID = 9999; 
    //   const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
    //   expect(response.statusCode).toBe(404);
    // });

    // testing it out
});

describe('GET /api/v1/guests', () => {
    it('should return an array of employees', async () => {
      const response = await request(app).get(`/api/v1/guests`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.guests).toBeInstanceOf(Array);
    }, 10000);
});