const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1
    },
    prod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }
})

const Order = mongoose.model('order',orderSchema)

module.exports = Order