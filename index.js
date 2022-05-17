const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
 const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
// app.use(cors());

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwx9p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snip6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const productCollection = client.db('stowageManagement').collection('service');

       // all products
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // single product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      console.log(product);
      res.send(product);
    });

    // post product data
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      // console.log('adding new Product', newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // update product
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const updatedProduct = req.body;
      // console.log(updatedProduct);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedProduct.quantity,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //Delete a data
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log(id, query);
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/productsuser', async (req, res) => {
      const email = req.query.email;
      // console.log(email);
      const query = { email: email };
      const cursor = productCollection.find(query);
      const productsuser = await cursor.toArray();
      res.send(productsuser);
    });

    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World2!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});