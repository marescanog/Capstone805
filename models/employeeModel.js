const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {addressSubSchema, photoSubSchema} = require('./modelUtils/subSchemas.js');

const employeeSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: [true, 'must have an email'],
        unique: true,
        validate: [validator.isEmail, 'email address must be a valid email']
    },
    keyWord: {
        type: String,
        required: [true, 'must have this field'],
        minlength: [10, 'incorrect number of characters'],
        select: false
    },
    keyGen: {
        type: String,
        required: [true, 'must have this field'],
        minlength: [10, 'incorrect number of characters'],
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'must have a first name']
    },
    lastName: {
        type: String,
        required: [true, 'must have a last name']
    },
    mobileNumber: String,
    address: {
        type: addressSubSchema,
        required: [true, 'must have an address']
    },
    employeeType: {
        type: String,
        required: [true, 'must have an employee type'],
        enum: {
            values: ['admin','manager','staff'],
            message: "must be part of categories"
        }
    },
    managerId: mongoose.Schema.Types.ObjectId,
    managerCode: {
        type: String,
        minlength: [6, 'incorrect number of characters'],
        maxlength: [6, 'incorrect number of characters']
    },
    createdOn: {
        type: Date,
        required: [true, 'must have a date'],
        default: new Date()
    },
    status: {
        type: String,
        required: [true, 'must have a status'],
        enum: {
            values: ['pending','active','deactivated'],
            message: "must be part of status categories"
        },
        default: 'pending'
    },
    dateHired: {
        type: Date,
        required: [true, 'must have a date'],
        default: new Date()
    },
    dateTerminated: Date,
    avatarPhotoUrl: photoSubSchema,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

employeeSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return resetToken;
}


// refactor later
employeeSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

employeeSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    if(candidatePassword=="" || keygen == "" || userPassword == "" || candidatePassword == null || keygen == null || userPassword == null){
        return false;
    }
    return  await bcrypt.compare(candidatePassword, userPassword);
}

// maybe transfer to Auth Controller
// Can also be used for updating passwords
employeeSchema.methods.generateNewHashandSalt = function(newPassword){
    const salt = randomStr.randomLetters(10, "uppercase");
    const secret = newPassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(newPassword);
    const digest = update.digest('hex');
    return  {h:digest, s:salt};
}

// User.findOne({email}).select('+keyWord +keyGen') // pass to here
employeeSchema.methods.getPassword = function(candidatePassword, salt){
    const secret = candidatePassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(candidatePassword);
    const digest = update.digest('hex');
    return  digest;
}

employeeSchema.methods.getHotelLaunchDate = function(){
    return new Date(2023, 10, 1);
}

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;