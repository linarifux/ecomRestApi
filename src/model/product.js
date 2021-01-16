const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainImage: {
        type: String,
    },
    images: [{
        image: {
            type: String
        }
    }],
    price: {
        type: Number,
        default: 0.0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'seller'
    }
})


const Product = mongoose.model('product',productSchema)

module.exports = Product