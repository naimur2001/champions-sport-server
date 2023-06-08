require('dotenv').config()
const express=require('express');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express()
//middleware
app.use(express.json());
app.use(cors());
// jwt
const verifyJWT=(req,res,next)=>{
  const authorization=req.headers.authorization;
  if(!authorization){
    return res.status(401).send({error:true,message:'unauthorized access'})
  }
  const token=authorization.split(' ')[1];

jwt.verify(token,process.env.JWT_TOKEN,(err,decoded)=>{
  if (err) {
    return res.status(403).send({error:true,message:'expired access'})
  }
  req.decoded=decoded;
  next()
}) 
 
}
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
// jwt post

app.post('/jwt',(req,res)=>{
  const user=req.body;
  const token=jwt.sign(user,process.env.JWT_TOKEN,
    {expiresIn: '3h'});
    res.send({token})
})
// admin email get
app.get('/user/admin/:email', async(req,res)=>{
  const email =req.params.email;
  if (req.decoded.email !== email) {
    res.send({admin: false})
  }
  const query={email: email};
  const user =  await usersCollection.findOne(query);
  const result={admin: user?.role === 'admin'};
  res.send(result)
})
//user patch
app.patch('/user/admin/:id', async (req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)};
  const updateDoc={
    $set: {
      role: 'admin'
    },
  }
  const result=await userCollection.updateOne(filter,updateDoc);
  res.send(result)
})
// admin 
const verifyAdmin=async (req,res,next)=>{
  const email =req.decoded.email;
  const  query={email: email};
  const user =  await usersCollection.findOne(query);
if ( user?.role !== 'admin') {
  return res.status(403).send({error:true,message:'forbidden message'})
}
next();
}
// user post
app.post('/users', async(req,res)=>{
  const user =req.body;
  // console.log(user);
  const query={email: user.email}
  const ExistUser=await usersCollection.findOne(query);
 
  if (ExistUser) {
    return res.send({message: 'User already exists'})
  }
  const result=await usersCollection.insertOne(user)
  res.send(result)
})
// user get
app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

//clases get
app.get('/classes',async (req,res)=>{
  const result =await classesCollection.find().toArray();
  res.send(result);
})
//instructors get
app.get('/instructors',async (req,res)=>{
  const result =await instructorsCollection.find().toArray();
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
