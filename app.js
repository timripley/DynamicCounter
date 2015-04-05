// ==============================================
// DYNAMICCOUNTER
// ==============================================
// require('newrelic');

var auth       = require('./auth');
var express    = require('express');
var routes     = require('./routes');
var path       = require('path');
var moment     = require('moment');
var fs         = require('fs');
var logentries = require('node-logentries');
var app        = express();
var port       = process.env.PORT || 8080;
var router     = express.Router();

//- Logentries logging
var log = new logentries.logger(auth);

// ==============================================
// SETUP THE SERVER
// ==============================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', routes.index);
app.use('/', router);
app.enable('trust proxy'); //- Need to see if this is the most reliable way to get IP as it relies on the left-most entry in the X-Forwarded-* header

app.listen(port);

// ==============================================
// Frontend
// ==============================================

app.get('/countbuilder', routes.countbuilder);


// ==============================================
// COUNTDOWN TIMER AT /countdown?year=xx&month=xx&day=xx&hour=xx&minute=xx&digit=xx
// ==============================================

app.get('/countdown', function (req, res){
        var year = req.query.year;
        var month = req.query.month;
        var day = req.query.day;
        var hour = req.query.hour;
        var minute = req.query.minute;
        var digit = req.query.digit;

        var milliSecondsUntil = function () {
            var now = moment();
            var t = moment(year + "-" + month + "-" + day + " "+ hour + ":"+ minute);
            countdown = t.diff(now);
            if (countdown <= 0){
                countdown = 0;
            };
            return countdown;
        };

        milliSecondsUntil();


        countDownTimer = function () {
            secondsUntil = Math.round(countdown / 1000);
            daysUntil = parseInt(secondsUntil / 86400);
            secondsUntil = parseInt(secondsUntil % 86400);
            hoursUntil = parseInt(secondsUntil / 3600);
            secondsUntil = parseInt(secondsUntil % 3600);
            minutesUntil = parseInt(secondsUntil / 60);
            secondsUntil = parseInt(secondsUntil % 60);

            if(daysUntil < 100 && daysUntil > 10){
                daysUntil = "0" + daysUntil;
            };

            if(daysUntil < 10 && daysUntil > 0){
                daysUntil = "00" + daysUntil;
            };

            if(daysUntil < 1 || daysUntil.length === 0){
                daysUntil = "000";
            };

            if(hoursUntil < 10){
                hoursUntil = "0" + hoursUntil;
            };
            if(hoursUntil < 1){
                hoursUntil = "00";
            };
        };

        countDownTimer();

        splitNumbers = function () {
            // Days
            daysFirstDigit = String(daysUntil).charAt(0);
            daysSecondDigit = String(daysUntil).charAt(1);
            daysThirdDigit = String(daysUntil).charAt(2);
         
            // Hours
            hoursFirstDigit = String(hoursUntil).charAt(0);
            hoursSecondDigit = String(hoursUntil).charAt(1);
            if(hoursSecondDigit.length === 0) {
                hoursFirstDigit = 0;
                hoursSecondDigit = hoursUntil;
            };

            // Minutes
            minutesFirstDigit = String(minutesUntil).charAt(0);
            minutesSecondDigit = String(minutesUntil).charAt(1);
            if(minutesSecondDigit.length === 0) {
                minutesFirstDigit = 0;
                minutesSecondDigit = minutesUntil;
            };
            // Seconds
            secondsFirstDigit = String(secondsUntil).charAt(0);
            secondsSecondDigit = String(secondsUntil).charAt(1);
            if(secondsSecondDigit.length === 0) {
                secondsFirstDigit = 0;
                secondsSecondDigit = secondsUntil;
            };

            if(countdown <= 0) {
                daysFirstDigit = 0;
                daysSecondDigit = 0;
                daysThirdDigit = 0;
            };

        };      

        splitNumbers();

        getImages = function() {
            // Days
            D1 = fs.readFileSync('./public/images/arial/' + daysFirstDigit     + '.gif');
            D2 = fs.readFileSync('./public/images/arial/' + daysSecondDigit    + '.gif');
            D3 = fs.readFileSync('./public/images/arial/' + daysThirdDigit     + '.gif');    
            // Hours
            H1 = fs.readFileSync('./public/images/arial/' + hoursFirstDigit    + '.gif');
            H2 = fs.readFileSync('./public/images/arial/' + hoursSecondDigit   + '.gif');
            // Minutes
            M1 = fs.readFileSync('./public/images/arial/' + minutesFirstDigit  + '.gif');
            M2 = fs.readFileSync('./public/images/arial/' + minutesSecondDigit + '.gif');
            // Seconds
            S1 = fs.readFileSync('./public/images/arial/' + secondsFirstDigit  + '.gif');
            S2 = fs.readFileSync('./public/images/arial/' + secondsSecondDigit + '.gif');
            // Tracking
            imgt = fs.readFileSync('./public/images/t/t.gif');
           };

        getImages();

        setDigit = function(){

            if(digit === "D1"){
                image = D1;
            }
            else if(digit === "D2"){
                image = D2;
            }
            else if(digit === "D3"){
                image = D3;
            }
            else if(digit === "H1"){
                image = H1;
            }
            else if(digit === "H2"){
                image = H2;
            }
            else if(digit === "M1"){
                image = M1;
            }
            else if(digit === "M2"){
                image = M2;
            }
            else if(digit === "S1"){
                image = S1;
            }
            else if(digit === "S2"){
                image = S2;
            }
            else{
                image = "ERROR"
            };
        };

        setDigit();

        // RUN EVERY SECOND
        setInterval(function () {
            countDownTimer(); 
            milliSecondsUntil();
            splitNumbers();
            getImages();
            setDigit();
        }, 1000);

        res.writeHead(200, {'Content-Type': 'image/gif', 'Cache-Control' :'no-store, no-cache, must-revalidate', 'Connection' :'keep-alive', 'Expires' : '-1', 'Pragma' : 'no-cache', 'Cache-directive' : 'no-cache', 'Pragma-directive' : 'no-cache' });
        res.end(image, 'binary');
});

// ==============================================
// TRACKING PIXEL AT /TRACK
// ==============================================

router.get('/track', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/gif', 'Cache-Control' :'no-store, no-cache, must-revalidate', 'Connection' :'keep-alive', 'Expires' : '-1', 'Pragma' : 'no-cache', 'Cache-directive' : 'no-cache', 'Pragma-directive' : 'no-cache'  });
    res.end(imgt, 'binary');
    var id = req.query.id;
    var ua = req.headers['user-agent'];
    var ip = req.ip;
    log.info("["+ id +"]" + "[" + ua + "]" + "[" + ip + "]");
});

// ==============================================
// CONSOLE LOGS AND DEBUGGING
// ==============================================

console.log('The magic happens on port ' + port +'.');