const request = require('supertest');
const app = require('../app');
const { Employee } = require('../models/employeeModel');
// const mongoose = require('mongoose');
// const {Types} = mongoose;

describe('Employees API', () => {
  describe('GET /api/v1/employees', () => {
    it('should return all employees', async () => {
      const employees = await Employee.create([
        { emailAddress: 'JohnDoe@mail.com', firstName:'John',lastName:'Doe', age: 30, mobileNumber:7894612584 },
        { emailAddress: 'Jaoe@mail.com', firstName:'John',lastName:'Doe', age: 25, mobileNumber:7894612584 },
      ]);

      const res = await request(app)
        .get('/api/v1/employees')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.status).toEqual('success');
      expect(res.body.data.employees.length).toBe(2);
      expect(res.body.data.employees[0].emailAddress).toEqual(employees[0].emailAddress);
      expect(res.body.data.employees[0].firstName).toEqual(employees[0].firstName);
      expect(res.body.data.employees[0].lastName).toEqual(employees[0].lastName);
      expect(res.body.data.employees[0].mobileNumber).toEqual(employees[0].mobileNumber);
    });

    it('should return an error when there are no employees', async () => {
      await Employee.deleteMany();

      const res = await request(app)
        .get('/api/v1/employees')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(res.body.status).toEqual('error');
      expect(res.body.message).toMatch(/Error while retrieving/);
    });
  });
});