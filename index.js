const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orodex1.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("gariBazar");
    const productsCollection = database.collection("products");
    const bookingsCollection = database.collection("bookings");

    //GET API
    app.get("/allProducts", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page, size);
      const query = {};
      const cursor = productsCollection.find(query);
      const result = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productsCollection.estimatedDocumentCount();
      res.json({ count, result });
    });
    app.get("/allBookings", async (req, res) => {
      const bookings = bookingsCollection.find({});
      const result = await bookings.toArray();
      res.json(result);
    });

    app.get("/productDetail/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result);
    });
    app.get("/booking/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const booking = bookingsCollection.find(query);
      const result = await booking.toArray();
      res.json(result);
    });

    app.get("/product/suv", async (req, res) => {
      const query = { bodyType: "SUV" };
      const suvProduct = productsCollection.find(query);
      const result = await suvProduct.toArray();
      res.json(result);
    });

    app.get("/product/sedan", async (req, res) => {
      const query = { bodyType: "Sedan" };
      const sedanProduct = productsCollection.find(query);
      const result = await sedanProduct.toArray();
      res.json(result);
    });

    app.get("/product/hatchback", async (req, res) => {
      const query = { bodyType: "Hatchback" };
      const hatchbackProduct = productsCollection.find(query);
      const result = await hatchbackProduct.toArray();
      res.json(result);
    });

    //POST API
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      console.log(result);
      res.json(result);
    });
    app.post("/addBookNow", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      console.log(result);
      res.json(result);
    });
    // PUT API
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: body.status,
        },
      };
      const result = await bookingsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });
    // Delete api
    app.delete("/deleteBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to graribazar server");
});

app.listen(port, () => {
  console.log("Garibazar app is listening on port", port);
});
