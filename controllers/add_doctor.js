var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var db = require.main.require ('./models/db_controller');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render('add_doctor.ejs');
});

router.post('/', function (req, res) {
    if (!req.files) {
        console.log('no file uploaded');
        return res.status(400).send('No file uploaded');
    }
    var file = req.files.image;
    var imageName = file.name;
    var imagePath = '/public/assets/images/upload_images/' + imageName;

    file.mv('.' + imagePath, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        db.add_doctor(
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.dob,
            req.body.gender,
            req.body.address,
            req.body.phone,
            imagePath,
            req.body.department,
            req.body.biography
        );

        console.log('1 doctor inserted');
        res.redirect('/add_doctor');
    });
});

module.exports = router;
