const mongoose = require('mongoose')

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    Filepath: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        match: /^https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i,
    }
});

module.exports = mongoose.model('blogs', blogsSchema);