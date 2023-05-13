require('dotenv').config()

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const jwt = require("jsonwebtoken");
const register = require('./controllers/register');
const home = require('./controllers/home');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const protectedRoute = require('./middleware/protectedRoute');

const personalAccessToken = process.env.PERSONAL_ACCESS_TOKEN;


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
});
      

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());



app.post('/signin', signin.handleSignin(db, bcrypt, jwt));
app.post('/register', register.handleRegister(db, bcrypt));

// auth routes
app.get('/', protectedRoute.protectedRoute, (req, res) => { home.handleHome(req, res, db, jwt, )});
app.get('/profile/:id', protectedRoute.protectedRoute, (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', protectedRoute.protectedRoute, (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res, personalAccessToken)})

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
