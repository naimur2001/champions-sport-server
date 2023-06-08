require('dotenv').config()
const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express()
//middleware
app.use(express.json());
app.use(cors());
// basic get  method---start
app.get('/',(req,res)=>{
  res.send('Server is OK Dude.....')
})
app.listen(port,()=>{
  console.log(`Server port is : ${port}`)
})

//database


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.rgn917b.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
     client.connect();
    // Send a ping to confirm a successful connection
  // collections
  const usersCollection=client.db('cs-db').collection('users')
  const classesCollection=client.db('cs-db').collection('classes')
  const instructorsCollection=client.db('cs-db').collection('instructors')

// user post
app.post('/users',async(req,res)=>{
  const user =req.body;
  // console.log(user);
  const query={email: user.email}
  const existingUser=await usersCollection.findOne(query);
  // console.log('exist',existingUser);
  if (existingUser) {
    return res.send({message: 'User already exists'})
  }
  const result=await usersCollection.insertOne(user)
  res.send(result)
})
// user get
app.get('/users',async (req,res)=>{
  const result =await usersCollection.find().toArray();
  res.send(result);
})
//clases get
app.get('/classes',async (req,res)=>{
  const result =await classesCollection.find().toArray();
  res.send(result);
})
 await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
