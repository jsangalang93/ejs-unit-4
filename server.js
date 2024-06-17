const express = require('express');
const app = express();

const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const methodOverride = require('method-override');
const morgan = require('morgan');

const port = process.env.PORT ? process.env.PORT : 3011;
// const authController = require('./controllers/auth.js');

// const session = require ('express-session');
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));
app.use(morgan('dev'));

// app.use(
//     session({
//       secret: process.env.SESSION_SECRET,
//       resave: false,
//       saveUninitialized: true,
//     })
//   );

mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error ", error);
  });

// MIDDLEWARE VVVV


//session setup prefs


const Logs = require('./models/log.js');

// Home
app.get('/', async (req, res) => {
    res.render('home.ejs', {
        // user: req.session.user,
    });
});

//TODO ADD AUTH CONTROLLER

app.get('/logs/new', (req, res)=> {
    res.render('logs/new.ejs')
})

app.post('/logs', async (req, res) => {
    try{
        const createdLog = await Logs.create(req.body)
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }

});
app.get('/logs', async (req, res) => {
    const allLogs = await Logs.find({});
    res.redirect('logs/index.ejs', {
        logs: allLogs
    })
})

app.get('/logs/:id', async (req, res) => {
    const foundLog = await Logs.findById(req.params.id);
    res.render('cards/show.ejs',  {card: foundCard});
});

// // TO DO VIP SECTION?

// app.get('logs/:id/edit', async (req, res) => {
//     const foundLog = await Logs.findById(req.params.id);
//     res.render('logs/edit.ejs', {log: foundLog});
// });

// // to do possible parse by month date etc

// app.delete('/logs/:id', async (req, res) => {
//     await Logs.findByIdAndDelete(req.params.id);
//     res.redirect('/logs');
// })

mongoose.connection.on('connected', ()=> {
    console.log(`connected to MongoDB at ${mongoose.connection.name}`);
})

app.listen(3011, () => {
    console.log('running on port 3011')
});