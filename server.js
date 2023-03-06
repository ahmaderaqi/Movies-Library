const express = require('express');
const server = express();
const cors = require('cors');
const pg = require('pg')
server.use(cors());
server.use(express.json());

//server.use(errorHandler);
const axios = require('axios');
require('dotenv').config();
const data = require('./movieData/data.json');
const error404 = require('./errors/error404.json');
const error500 = require('./errors/error500.json');




//creating objects of errors



const PORT = process.env.PORT||3000;

//create an object from client constructor 
const client = new pg.Client(process.env.DATABASE_URL);

function Data(id, title, release_date, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.id = id;
    this.release_date = release_date;
}
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler);
//server.get('/error', errorHandlerr);
server.get('/trend', trendingHandler);
server.get('/search', searchHandler);
server.get('/getMovies',getMoviesHandler);
server.post('/getMovies',addMoviesHandler);
server.delete('/getMovies/:id',deleteFavMovie);
server.put('/getMovies/:id',updateFavMovie);
server.get('*', defaultHandler);
server.use(errorHandler);




// functions handlers
function homeHandler(req, res) {
    // let dd=new Data(data.title,data.poster_path,data.overview);
    console.log("ahmad");
    res.status(200).json("home page");
}

function favoriteHandler(req, res) {
    res.send("Welcome to Favorite Page");
}

// function errorHandlerr(req, res) {
//     res.json(error500);
// }

function defaultHandler(req, res) {
    res.status(404).json(error404);
}

function trendingHandler(req, res) {
    try {
        const APIkey = process.env.api_key;
        let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIkey}&language=en-US`;


        axios.get(url)
            .then((result) => {
                //console.log(result.data);
                let mapResult = result.data.results.map((item) => {
                    let singleRecipe = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleRecipe;
                })
                res.status(200).send(mapResult);
            })

            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })

    }

    catch (error) {
        errorHandler(error, req, res);
    }
}

function searchHandler(req, res) {
    let name = "The Woman King";
    try {
        const APIkey = process.env.api_key;
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${APIkey}&language=en-US&query=The&page=2`;


        axios.get(url)
            .then((result) => {
                let movie = "";
                result.data.results.forEach((item) => {
                    if (item.title == name) {
                        let singleRecipe = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview);
                        movie = singleRecipe
                    }

                })

                res.status(200).send(movie);
            })

            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })

    }

    catch (error) {
        console.log("sorry and error");
        errorHandler(error, req, res);
    }
}
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}

function getMoviesHandler(req,res){
    const sql=`SELECT * FROM favMovie;`;
    client.query(sql).then((data) =>{
        console.log(data.rows);
        res.send(data.rows);

    })
    .catch(error=>{
        errorHandler(error,req,res);
    });
}

function addMoviesHandler(req,res){
    const movie=req.body;
    console.log(movie);
    
    const sql=`INSERT INTO favmovie (title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`;
    console.log(sql);
    const values=[movie.title,movie.release_date,movie.poster_path,movie.overview];
    client.query(sql,values).then((data) =>{
        res.send("data was added!");
    })
    .catch(error=>{
        errorHandler(error,req,res);
    });


}

function deleteFavMovie(req,res) {
    console.log(req.params);
    const id = req.params.id;
    const sql = `DELETE FROM favMovie WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(204).json({});
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}

function updateFavMovie(req,res){
    const id = req.params.id;
    const movie=req.body;
    const sql=`UPDATE favMovie SET title=$1, release_date=$2, poster_path=$3 , overview=$4 WHERE id=${id} RETURNING *`;
    const value=[movie.title,movie.release_date, movie.poster_path, movie.overview];
    client.query(sql,value).then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}
client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listening on ${PORT} : I am ready`);
    })
})

