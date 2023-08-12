var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');
var { check, validationResult } = require('express-validator');
var sweetalert = require('sweetalert2');

router.get('/', function (req, res) {
    res.render('login.ejs');
});

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital-management-system'
});

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', [
    check('username').notEmpty().withMessage("Username is required"),
    check('password').notEmpty().withMessage("Password is required")
], function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        con.query('select * from users where username = ? and password = ?', [username, password], function (error, results, fields) {
            if (error) {
                console.error(error);
                response.status(500).send('An error occurred while processing your request.');
                return;
            }

            if (results && results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.cookie('username', username);
                var status = results[0].email_status;
                if (status == "not_verified") {
                    response.send("Please verify your email");
                } else {
                    sweetalert.fire('Logged In!');
                    response.redirect('/home');
                }
            } else {
                response.send('Incorrect username / password');
            }
        });
    } else {
        response.send('Please enter username and password');
    }
});

module.exports = router;
