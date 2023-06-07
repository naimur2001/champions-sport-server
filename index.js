require('dotenv').config()
const express=require('express');
const cors=require('cors');
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
