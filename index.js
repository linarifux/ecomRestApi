const express = require('express')
const db = require('./src/db/db')
const sellerRoute = require('./src/route/seller')
const port = process.env.PORT || 5000

const app = express()

app.listen(port, () => {
    console.log(`server started listening on port: ${port}`);
})


// middlewares
app.use(express.json())


// seller route
app.use(sellerRoute)