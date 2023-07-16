const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    siteUrl: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    youtubeUrl: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Item', itemSchema)