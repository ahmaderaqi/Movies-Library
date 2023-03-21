DROP TABLE IF EXISTS favMovie;

CREATE TABLE IF NOT EXISTS favMovie (
    id serial primary key  ,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(10000),
    comment VARCHAR(10000)
);