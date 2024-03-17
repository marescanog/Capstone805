const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const {Types} = mongoose;

describe('GET /api/v1/employees/:id', () => {
    it('should return an employee for a given id', async () => {
      const employeeID = '65dfb20a9f65edacfd39b50d'; 

      const expectedResult = [{
        _id: employeeID,
        emailAddress: "dhawksby8@mailsac.com",
        keyWord: "$2a$12$l4KGJ3ME7Ydj5eflswze6.usn9tw.iKQJlDy3wVHVlOcoZQTQ0Xtm",
        keyGen: "XEQSTVNYVH",
        firstName: "Damaris",
        lastName: "Hawksbys",
        mobileNumber: "139-526-8227",
        address: {
            address: "961 Jenifer Street",
            city: "Whitby",
            postalCode: "MZ1DGN",
            country: "Canada",
            _id: "65dfb20a9f65edacfd39b50e"
        },
        employeeType: "manager",
        managerCode: "M59M6L",
        createdOn: "2023-11-01T15:28:22.860Z",
        status: "active",
        dateHired: "2023-10-27T02:46:03.667Z",
        __v:0
      }];
  
      const response = await request(app).get(`/api/v1/employees/${employeeID}`);
      // expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedResult);
    }, 10000);
  
    // it('should return a 404 for a form that does not exist', async () => {
    //   const contactFormID = 9999; 
    //   const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
    //   expect(response.statusCode).toBe(404);
    // });

    // testing it out
});

describe('GET /api/v1/employees', () => {
    it('should return an array of employees', async () => {
      const response = await request(app).get(`/api/v1/employees`);
      // expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    }, 10000);
});