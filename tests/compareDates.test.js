const {compareDates} = require('./../models/modelUtils/utilityFunctions');

describe('compareDates function', () => { 
    test('should return undefined when no parameters are passed', () => {
      expect(compareDates()).toBeUndefined();
    });
  
    test('should return undefined when a random string is passed as parameters', () => {
      expect(compareDates("randomStringA", "randomStringB")).toBeUndefined();
    });
  
    test('should return undefined when a random number is passed as parameters', () => {
      expect(compareDates(12345, 67890)).toBeUndefined();
    });
  
    test('Date A is before Date B - Day difference', () => {
      const dateA = new Date('January 4, 2023');
      const dateB = new Date('January 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(-1);
    });
  
    test('Date A is before Date B - Year difference', () => {
      const dateA = new Date('January 9, 2023');
      const dateB = new Date('January 4, 2024');
      expect(compareDates(dateA, dateB)).toBe(-1);
    });
  
    test('Date A is before Date B - Month difference', () => {
      const dateA = new Date('February 5, 2023');
      const dateB = new Date('April 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(-1);
    });
  
    test('Date A is before Date B - Random', () => {
      const dateA = new Date('March 21, 2024');
      const dateB = new Date('May 2, 2024');
      expect(compareDates(dateA, dateB)).toBe(-1);
    });
  
    test('Date A is after Date B - Day difference', () => {
      const dateA = new Date('January 15, 2023');
      const dateB = new Date('January 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(1);
    });
  
    test('Date A is after Date B - Year difference', () => {
      const dateA = new Date('January 9, 2025');
      const dateB = new Date('January 4, 2024');
      expect(compareDates(dateA, dateB)).toBe(1);
    });
  
    test('Date A is after Date B - Month difference', () => {
      const dateA = new Date('November 5, 2023');
      const dateB = new Date('April 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(1);
    });
  
    test('Date A is after Date B - Random', () => {
      const dateA = new Date('December 21, 2024');
      const dateB = new Date('December 25, 2023');
      expect(compareDates(dateA, dateB)).toBe(1);
    });
  
    test('Date A and Date B are Equal', () => {
      const dateA = new Date('January 5, 2023');
      const dateB = new Date('January 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(0);
    });

    test('Date A and Date B are Equal but different times', () => {
      const dateA = new Date('January 5, 2023, 12:00:00');
      const dateB = new Date('January 5, 2023');
      expect(compareDates(dateA, dateB)).toBe(0);
    });
});