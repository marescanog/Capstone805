const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
//const {Types} = mongoose;
const { getAllGuests } = require('../controllers/guestController');
const Guest = require('../models/guestModel');
// describe('GET /api/v1/contactFormSubmissions/:id', () => {
//     it('should return a contact form object for a given id', async () => {
//       const contactFormID = '65e5a07ba5fdf325b7fbbe47'; 

//       const expectedResult = [{
//         _id: contactFormID,
//         emailAddress: "aharbisherf@mailsac.com",
//         firstName: "Aileen",
//         lastName: "Harbisher",
//         title: "Where is the hotel?",
//         messageBody: "I think I want to register but I want to know where the hotel is first.",
//         createdOn: "2024-03-04T10:12:08.903Z",
//         __v:0
//       }];
  
//       const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
//       // expect(response.statusCode).toBe(200);
//       expect(response.body).toEqual(expectedResult);
//     }, 10000);
  
//     // hello
//     // it('should return a 404 for a form that does not exist', async () => {
//     //   const contactFormID = 9999; 
//     //   const response = await request(app).get(`/api/v1/contactFormSubmissions/${contactFormID}`);
//     //   expect(response.statusCode).toBe(404);
//     // });

//     // testing it out-asjoidjasjdioasjdisa
// });


// describe('GET /api/v1/contactFormSubmissions', () => {
//   it('should return an array of contact forms', async () => {
//     const response = await request(app).get(`/api/v1/contactFormSubmissions`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
//   }, 10000);
// });

describe('getAllGuests', () => {
  it('should return an error when req is null or empty', async () => {
    await expect(getAllGuests(null, {})).rejects.toThrow('Error: Required parameter "req" is missing');
    await expect(getAllGuests({}, {})).rejects.toThrow('Error: Required parameter "req" is missing');
  });
});

describe('getAllGuests', () => {
  it('should return an error message when there is a server error', async () => {
    Guest.find = jest.fn().mockRejectedValue(new Error('Internal server error'));
    await expect(getAllGuests({}, {})).resolves.toMatchObject({
      status: 'error',
      message: 'Internal server error'
    });
    Guest.find = jest.fn();
  });
});

