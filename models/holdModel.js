const mongoose = require('mongoose');

const holdSchema = new mongoose.Schema({
    sessionID: { type: String, required: true },
    offer_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    room_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Room' },
    guest_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Guest', required: false },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, index: { expires: '10m' } },  // TTL index
    holdStartDateTime: { type: Date, required: true }
});

const Hold = mongoose.model('hold', holdSchema);

module.exports = Hold;