const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name and must be unique'],
        unique: true
    },
    category: {
        type: String,
        required: [true, 'must have a category'],
        default: 'Offered Amenities'
    },
    icon: String
});

const Amenity = mongoose.model('amenity', amenitySchema);

module.exports = Amenity;