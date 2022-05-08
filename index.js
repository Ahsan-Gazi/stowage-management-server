const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
 const ObjectId = require('mongodb').ObjectId;

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

        app.get('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // POST
        app.post('/service', async(req, res) =>{
          const newService = req.body;
          const result = await serviceCollection.insertOne(newService);
          res.send(result);
      });

      // update Service
      app.put('/service/:id', async(req, res) =>{
        const id = req.params.id;
        const updatedService = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                name: updatedService.name,
                email: updatedService.email
            }
        };
        const result = await serviceCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    });

         // DELETE
         app.delete('/service/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await serviceCollection.deleteOne(query);
          res.send(result);
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