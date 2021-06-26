require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const app = express();

require('./src/db/connect');
const Register = require('./src/models/registers');
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partial_path = path.join(__dirname, "./templates/partials");
// ('/JS', express.static(__dirname + '../../public/JS'))

// console.log(path.join(__dirname, "./public"));



//Using as Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));






app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);
console.log(process.env.SECRET_KEY);

app.get('/', function(req, res) {
    res.render("login");
});
app.get('/secret', function(req, res) {
    res.render("secret");
});

app.get('/logout', function(req, res) {
    try {

        res.clearCookie('jwt');
        console.log('logout Successfully');
        // req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);

    }
})


app.get('/register', function(req, res) {
    res.render("register");
});
app.get('/login', function(req, res) {
    res.render('login');
})

app.post('/register', async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const steamregister = new Register({
                username: req.body.username,
                country: req.body.country,
                checkbox: req.body.checkbox,
                password: password,
                cpassword: cpassword
            });
            //Middleware
            console.log('The success part' + steamregister);
            const token = await steamregister.generateAuthToken();
            console.log('The token part' + token);
            // const cookie = await usermail.generateAuthToken();



            // Cookies
            // res.cookie('jwt', cookie, {
            //     expires: new Date(Date.now() + 30000),
            //     httpOnly: true
            // });
            // console.log(cookie);








            //saving data on database
            const registered = await steamregister.save();
            console.log('The token part' + token);
            res.status(201).render("login");

        } else {
            res.send("Passwords do not match");
        }

    } catch (error) {
        res.status(404).send(error);
        console.log('The error occured page')

    }
});
//Login Validation
app.post('/login', async(req, res) => {
    try {
        const email = req.body.username;
        const password = req.body.password;
        const usermail = await Register.findOne({ username: email });
        const matching = await bcrypt.compare(password, usermail.password);
        const token = await usermail.generateAuthToken();
        console.log('The token part' + token);
        const cookie = await usermail.generateAuthToken();

        res.cookie('jwt', cookie, {
            expires: new Date(Date.now + 600000),
            httpOnly: true
        });
        console.log(cookie);


        if (matching) {
            res.status(201).render('index');
        } else {
            res.send('Invalid email or password')
        }

    } catch (error) {
        res.status(400).send('Invalid Email or Password');
    }
})

app.listen(port, function() {
    console.log(`Server is running at port  ${ port }`);
});