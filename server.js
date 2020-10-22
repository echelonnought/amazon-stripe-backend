require('dotenv').config();
const cors = require('cors');
const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 9000;

//middlewares

app.use(express.json());

app.use(cors())

// routes
app.get('/', (req, res) => {
    res.send("All good up in here!")
});

app.post('/payment', ( request, response ) => {
    console.log("request:", request.body)
    const { token, basket } = request.body;
   
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: basket * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {idempotencyKey})
    }).then(result => response.status(200).json(result)
    )
    .catch(err => console.log(err));
})

//listen

app.listen(PORT, () => console.log('listening at port: 9000' ))