const mongoose = require('mongoose');

const singupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('signs', singupSchema);