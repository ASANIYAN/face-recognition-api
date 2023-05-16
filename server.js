require('dotenv').config()

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const jwt = require("jsonwebtoken");
const register = require('./controllers/register');
const home = require('./controllers/home');
const signin = require('./controllers/signin');
const logout = require('./controllers/logout');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const protectedRoute = require('./middleware/protectedRoute');
const blacklist = require('./middleware/blacklist');

const personalAccessToken = process.env.PERSONAL_ACCESS_TOKEN;


const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DBConnLink,
      ssl: {
        rejectUnauthorized: false
      }
    }
});
      

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.post('/register', register.handleRegister(db, bcrypt));
app.post('/signin', signin.handleSignin(db, bcrypt, jwt));
app.post('/logout', logout.handleLogout(db));
app.get('/', (req,res) => { res.send('it is working') })

// auth routes
app.get('/home', blacklist.checkBlacklist(db), protectedRoute.protectedRoute, (req, res) => { home.handleHome(req, res, db, jwt)});
app.get('/profile/:id', blacklist.checkBlacklist(db), protectedRoute.protectedRoute, (req, res) => {profile.handleProfile(req, res, db)});
app.put('/image', blacklist.checkBlacklist(db), protectedRoute.protectedRoute, (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res, personalAccessToken)});

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
