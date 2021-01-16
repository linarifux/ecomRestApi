const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ecomapp', {useCreateIndex: true, useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology: true}, ()=> console.log("DB Connected...."))


module.exports = mongoose