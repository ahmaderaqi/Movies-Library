const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
//server.use(errorHandler);
const axios = require('axios');
require('dotenv').config();
const data = require('./movieData/data.json');
const error404 = require('./errors/error404.json');
const error500 = require('./errors/error500.json');




//creating objects of errors



const PORT = 3000;

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


server.listen(PORT, () => {
    console.log(`listening on ${PORT} : I am ready`);
})