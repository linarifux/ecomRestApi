const mongoose = require('mongoose')
const Product = require('../model/product')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sellerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error('Invalid Email')
            }
        }
    
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(pass){
            if(pass.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


// virtual property
sellerSchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField:'owner'
})


// hashing password
sellerSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Deleting seller with products
sellerSchema.pre('remove', async function(next){
    const seller = this
    await Product.deleteMany({owner: seller._id})
    next()
})


// Generating Authorization Token
sellerSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'voidarif')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// Hiding password and tokens array from seller instance
sellerSchema.methods.toJSON = function(){
    const seller = this
    const  sellerObject = seller.toObject()
    delete sellerObject.password
    delete sellerObject.tokens
    return sellerObject
}

// Finding seller profile with credentials
sellerSchema.statics.findByCredentials = async (email,password) => {
    const seller = await Seller.findOne({email})
    if(!seller){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, seller.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return seller
}


const Seller = mongoose.model('seller',sellerSchema)

module.exports = Seller