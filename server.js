require('dotenv').config()
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

// db.select('*').from('users').then(data => {
//     console.log(data);
// })
// db.select('*').from('login').then(data => {
//     console.log(data);
// })
// console.log(db.select('*').from('login'));
      

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res, personalAccessToken)})

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
