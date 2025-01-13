require('dotenv').config();
const express=require('express');
const connectDB=require('./config/database');
const authRoutes=require('./routes/authRoutes')

const app=express();

connectDB();

app.use(express.json());

app.use('/api', authRoutes);

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({error:"Something went wrong!"});
});

const PORT= process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`Server running on post ${PORT}`);
});