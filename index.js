const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwx9p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snip6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
// const uri = "mongodb+srv://ahsan:ahsan@cluster0.vwx9p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('stowageManagement').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            // const services = await serviceCollection.find(query);
           const cursor = serviceCollection.find(query);
           const services = await cursor.toArray();
            res.send(services);
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