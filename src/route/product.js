const express = require('express')
const auth = require('../middleware/auth')
const Product = require('../model/product')

const router = express.Router()


// creating a product
router.post('/api/products', auth, async (req,res) => {
    const product = new Product({
        ...req.body,
        owner: req.seller._id
    })
    try{
        await product.save()
        res.status(201).send(product)
    }catch(e){
        res.status(e)
    }

})

// products created by the seller
router.get('/api/myproducts', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if(req.query.onSale){
        if(req.query.onSale === 'true'){
            match.onSale = true
        }else{
            match.onSale = false
        }
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try{
        const seller = req.seller
        await seller.populate({
            path: 'products',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        if(seller.products.length === 0){
            return res.status(404).send(seller.products)
        }
        res.status(200).send(seller.products)
    }catch(e){
        res.status(400).send(e)
    }
})


// updating a product with ID
router.patch('/api/myproducts/:id', auth, async (req,res) => {
    const allowedUpdates = ['title','description','price','quantity','onSale','images',     'mainImage']
    const updates = Object.keys(req.body)
    const isMatch = updates.every((update) => allowedUpdates.includes(update))

    if(!isMatch){
        return res.status(501).send('Invalid Updates')
    }
    try{
        const product = await Product.findOne({_id: req.params.id, 'owner': req.seller._id})
        if(!product){
            return res.status(404).send('No products found')
        }
        updates.forEach(update => {
            product[update] = req.body[update]
        });
        await product.save()
        res.status(201).send(product)
    }catch(e){
        res.status(400).send(e)
    }
})

// Delete a product by ID
router.delete('/api/myproducts/:id', auth, async (req,res) => {
    try{
        const product = await Product.findOneAndDelete({_id: req.params.id, 'owner':req.seller._id})
        if(!product){
            return res.status(404).send('No products')
        }
        res.status(200).send("Deleted")
    }catch(e){
        res.status(400).send(e)
    }
})


// all the products
router.get('/api/products', async (req,res) => {
    try{
        const products = await Product.find({})
        if(products.length === 0){
            return res.status(404).send('No products found!')
        }
        res.status(200).send(products)
    }catch(e){
        res.status(400).send(e)
    }
})





module.exports = router