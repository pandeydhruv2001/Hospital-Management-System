var express = require('express');
var flash = require('flash');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var randomToken = require('random-token');
var db = require.main.require('./models/db_controller');


// router.get('/',function(req,res){
//     res.render('resetpassword.ejs')
// })

router.post('/',function(req,res){
    var email = req.body.email;
    db.findOne(email,function(err,resultone){
        if(!resultone){
            console.log("Mail deos not exist");
            res.redirect('Mail does not exist');
        }
        var id = resultone[0].id;
        var email = resultone[0].email;
        var token = randomToken(8);
        db.Temp(id,email,token,function(err,resulttwo){
            var output=`<p>Dear User,</p>
            <p>You are receiving this email as you requested to reset your password</p
            <ui>
                <li>User ID: `+id+`</li>
                <li>Token:`+token+`</li>
        `
        
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "",
          pass: "",
        },
        port:465,
        host: 'smtp.gmail.com'
      });
      var mailOptions = {
        from: "",
        to: email,
        subject: "Email Verification", 
        html: output, 
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          return console.log(err);
        }
        console.log(info);
      });

    })
})
    res.send("A Token has been sent to your email");
});

module.exports = router;