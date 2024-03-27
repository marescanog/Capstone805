const  Guest = require('./../models/guestModel.js');
const {getRandomInt} = require('./../models/modelUtils/utilityFunctions');
const randomStr = require('random-string-alphanumeric-generator');

describe('Random User Password Verification', () => {
    let randomUser;
    let keygen;
    let keyword;
    let correctPassword;
    // random string
    let falsePassword = randomStr.randomLetters(10);

    // Mocks and setup for database operations
    beforeAll(async () => {
        const guests = await Guest.find({}).select('+keyWord +keyGen');
        randomUser = guests[getRandomInt(0,guests.length)];
        keygen = randomUser.keyGen;
        keyword = randomUser.keyWord;
        correctPassword = `${randomUser.firstName}2024`;
    });

    test('returns false for null/no parameters', async () => {
        const result = await Guest.correctPassword(null, null, null);
        expect(result).toBeFalsy();
    });
    
    test('returns false for no candidate password', async () => {
        const result = await Guest.correctPassword('', keygen, keyword);
        expect(result).toBeFalsy();
    });

    test('returns false for no keygen', async () => {
        const result = await Guest.correctPassword(correctPassword, '', keyword);
        expect(result).toBeFalsy();
    });

    test('returns false for no hashed password', async () => {
        const result = await Guest.correctPassword(correctPassword, keygen, '');
        expect(result).toBeFalsy();
    });

    test('returns false for correct candidatePassword, incorrect keygen', async () => {
        const result = await Guest.correctPassword(correctPassword, "HJSD79BOIYEAYEA_", keyword);
        expect(result).toBeFalsy();
    });

    test('returns false for incorrect candidatePassword, correct keygen', async () => {
        const result = await Guest.correctPassword(falsePassword, keygen, keyword);
        expect(result).toBeFalsy();
    });

    test('returns true for correct candidatePassword, correct keygen', async () => {
        const result = await Guest.correctPassword(correctPassword, keygen, keyword);
        expect(result).toBeTruthy();
    });

});