const express = require('express')
const Order = require('../model/order')
const Product = require('../model/product')

const router = express.Router()


// creating a order
router.post('/api/orders', async (req,res) => {
    try{
        const product = await Product.findById(req.body.prod)
        if(!product){
            return res.status(404).send('No products')
        }
        const order = new Order(req.body)
        await order.save()
        res.status(201).send(order)
    }catch(e){
        res.status(400).send(e)
    }
})


// get all orders with product title and price
router.get('/api/orders', async (req,res) => {
    try{
        const orders = await Order.find({}).populate({
            path: 'prod',
            select: 'title price'
        })
        if(!orders.length === 0){
            return res.status(404).send("No products")
        }
        res.send(orders)
    }catch(e){
        res.status(400).send(e)
    }
})

// individual order details
router.get('/api/orders/:id', async (req,res) => {
    try{
        const order = await Order.findById(req.params.id).populate('prod')
        if(!order){
            return res.status(404).send('No order found')
        }
        res.send(order)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router