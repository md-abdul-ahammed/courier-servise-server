const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8000;
const cors = require("cors")

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wtvgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('courier_service');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        app.post("/services", async (req, res) => {
            const result = await servicesCollection.insertOne(req.body);
            res.send(result)
        })


        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })


        app.post("/order", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result)
        })

        //Add MyOrders
        app.get("/myOrders/:email", async (req, res) => {
            const result = await ordersCollection.find({ user_email: req.params.email }).toArray()
            res.send(result)
        })
        //Delete Product 
        app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id
            const result = await ordersCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })


        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})