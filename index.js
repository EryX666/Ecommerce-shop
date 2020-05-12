const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./Routes/admin/auth');
const adminProductsRouter = require('./Routes/admin/products');
const productsRouter = require('./Routes/products')
const cartsRouter = require('./Routes/carts');


const app = express();

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['bnlnjlfjnweoindoihn13nonoasdncx0nasxzknxclknwqp9032ncsdkjlnc8943v']
}));
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);


app.listen(3000, () => {
    console.log('Server started, running on port: 3000');
});

