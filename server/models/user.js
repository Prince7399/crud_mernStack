const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    age: {
        type: String
    },
    slug: {
        type: String
    }
})

module.exports = mongoose.model('Users', UserSchema);