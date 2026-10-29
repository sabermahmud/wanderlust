
import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  await client.connect();
  console.log("Successfully connected to MongoDB!");
  return client
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust");
const destinationCollection = db.collection("destinations")

app.post("/add-destination",async (req, res)=>{
  const data = req.body;
   const result = await destinationCollection.insertOne(data)
  console.log(result)
  res.send(result)
 
})

app.get("/all-destinations", async(req, res)=>{
  const result = await destinationCollection.find().toArray();
  res.send(result)
})

app.get("/", (req, res) => {
  res.send("Hello From WanderLust server");
});





async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exitCode = 1;
  }
}

startServer();
