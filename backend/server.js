const express = require ('express');
const path = require ('path');
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');
const config = require ('./config');
const userRoute = require ('./routes/userRoute');
const productRoute = require ('./routes/productRoute');
const orderRoute = require ('./routes/orderRoute');
const uploadRoute = require ('./routes/uploadRoute');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  
  apis: ['./routes/*.js'],
  
  swaggerDefinition: {
           info:{
                 version: "1.0.0",
                 title: 'Swagger Documentation',
                 description: 'A api documentation page',
                 contact: {
                     name: 'Shaunak Amble'
                 },
                 servers: ["http://localhost:5000"]
             }
         },
};
const specs = swaggerJsdoc(options);

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(() => {
    console.log('Connected to database !!');})
  .catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use(express.static(path.join(__dirname, '/../frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});

module.exports=app;