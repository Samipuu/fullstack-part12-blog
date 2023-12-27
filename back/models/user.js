const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, required: true, unique: true, minLength: 3 },
    passwordHash: { type: String },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.passwordHash
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('User', userSchema)
