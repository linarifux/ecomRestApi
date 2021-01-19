const express = require('express')
const db = require('./src/db/db')
const sellerRoute = require('./src/route/seller')
const productRoute = require('./src/route/product')
const orderRoute = require('./src/route/order')
const port = process.env.PORT || 5000

const app = express()

app.listen(port, () => {
    console.log(`server started listening on port: ${port}`);
})


// middlewares
app.use(express.json())


// seller route
app.use(sellerRoute)

// products route
app.use(productRoute)

// order route
app.use(orderRoute)