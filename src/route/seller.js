const express = require('express')
const Seller = require('../model/seller')
const auth = require('../middleware/auth')

const router = express.Router()


// creating a seller account
router.post('/api/sellers', async (req,res) => {
    try{
        const seller = new Seller(req.body)
        const token = await seller.generateAuthToken()
        // await seller.save()
        res.status(201).send({seller, token})
    }catch(e){
        res.status(400).send(e)
    }
})

// login seller account
router.post('/api/sellers/login', async (req,res) => {
    try{
        const seller = await Seller.findByCredentials(req.body.email,req.body.password)
        const token = await seller.generateAuthToken()
        res.status(200).send({seller, token})
    }catch(e){
        res.status(400).send(e)
    }
})

// seller logout
router.post('/api/sellers/logout', auth, async (req,res) => {
    const seller = req.seller
    const token = req.token
    try{
        seller.tokens = seller.tokens.filter((item) => {
            return item.token !== token
        })
        await seller.save()
        res.status(200).send("Logged out")
    }catch(e){
        res.status(400).send(e)
    }
})

// update a seller
router.patch('/api/sellers', auth, async (req,res) => {
    const allowedUpdates = ['firstName','lastName','email','password']
    const updates = Object.keys(req.body)
    const isMatch = updates.every((update) => allowedUpdates.includes(update))
    if(!isMatch){
        return res.status(400).send('Invalid Updates')
    }
    try{
        const seller = req.seller
        updates.forEach(update => {
            seller[update] = req.body[update]
        });
        await seller.save()
        res.status(200).send(seller)
    }catch(e){
        res.status(400).send(e)
    }
})

// seller profile
router.get('/api/sellers/me',auth, async (req,res) => {
    try{
        const seller = req.seller.toObject()
        res.status(200).send(req.seller)

    }catch(e){
        res.status(400).send(e)
    }
})

// all sellers
router.get('/sellers', async (req,res) => {
    try{
        const sellers = await Seller.find({})
        if(sellers.length === 0){
            return res.status(404).send('No sellers found!')
        }
        res.status(200).send(sellers)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router