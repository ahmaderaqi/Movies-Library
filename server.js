const express=require('express');
const server=express();
const cors = require('cors');
server.use(cors());
const data=require('./movieData/data.json');
const error404=require('./errors/error404.json');
const error500=require('./errors/error500.json');

//creating objects of errors



const PORT = 3000;

function Data(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

//home route
server.get('/',(req,res)=>{
    let dd=new Data(data.title,data.poster_path,data.overview);
    res.status(200).json(dd);
})

//favorite route
server.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
})

//error route
server.get('/error',(req,res)=>{
    res.json(error500);
})

//default route
server.get('*',(req,res)=>{
    res.status(404).json(error404);

})

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})