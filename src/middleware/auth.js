const jwt = require('jsonwebtoken')
const Seller = require('../model/seller')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, 'voidarif')
        const seller = await Seller.findOne({_id: decoded._id, 'tokens.token':token})
        if(!seller){
            throw new Error()
        }
        req.seller = seller
        req.token = token
        next()
    }catch(e){
        res.status(401).send('Please, Authenticate')
    }
}


module.exports = auth