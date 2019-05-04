const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;



const DocumentSchema = new Schema({
    type_document: {
        type: String,
        trim: true,
        required: true,
    },
    value_document: {
        type: String,
        required: true,
    },
    shipping_date: {
        type: Date,
        required: false
    },
    expiration_date: {
        type: Date,
        required: false
    },
    sensitive: {
        type: Boolean,
        required: true,
        default: false
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }

});
module.exports = mongoose.model('Document', DocumentSchema)