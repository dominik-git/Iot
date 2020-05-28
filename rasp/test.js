var Gpio = require('pigpio').Gpio;
var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function() {
    console.log('listening for requests on port 4000,');
});
// Static files
app.use(express.static('public'));

// process.on("SIGINT", function() {

// });


// Socket setup & pass server


// Pin number assignment for L293D

//rigt side
const PWMA_PIN_NUM = 24;
const AIN1_PIN_NUM = 23;
const AIN2_PIN_NUM = 18;

//left side
const PWMB_PIN_NUM = 22;
const BIN1_PIN_NUM = 27;
const BIN2_PIN_NUM = 17;


const LINE1_PIN_NUM = 5;
const LINE2_PIN_NUM = 06;
const LINE3_PIN_NUM = 13;
const LINE4_PIN_NUM = 19;
const LINE5_PIN_NUM = 7;

// GPIO PIN open
var PWMA_PIN = new Gpio(PWMA_PIN_NUM, { mode: Gpio.OUTPUT });
var AIN1_PIN = new Gpio(AIN1_PIN_NUM, { mode: Gpio.OUTPUT });
var AIN2_PIN = new Gpio(AIN2_PIN_NUM, { mode: Gpio.OUTPUT });

var PWMB_PIN = new Gpio(PWMB_PIN_NUM, { mode: Gpio.OUTPUT });
var BIN1_PIN = new Gpio(BIN1_PIN_NUM, { mode: Gpio.OUTPUT });
var BIN2_PIN = new Gpio(BIN2_PIN_NUM, { mode: Gpio.OUTPUT });

var LINE1_PIN = new Gpio(LINE1_PIN_NUM, { mode: Gpio.INPUT, alert: true });
var LINE2_PIN = new Gpio(LINE2_PIN_NUM, { mode: Gpio.INPUT, alert: true });
var LINE3_PIN = new Gpio(LINE3_PIN_NUM, { mode: Gpio.INPUT, alert: true });
var LINE4_PIN = new Gpio(LINE4_PIN_NUM, { mode: Gpio.INPUT, alert: true });
var LINE5_PIN = new Gpio(LINE5_PIN_NUM, { mode: Gpio.INPUT, alert: true });
//31 29

function pin_init() {
    PWMA_PIN.analogWrite(0);
    PWMB_PIN.analogWrite(0);
    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(0);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(0);


}
const doStuffAsync = async(callBackFunc) => {
    await setAsyncTimeout(() => {
        callBackFunc();
        console.log("calback");
    }, 200);
};

function followTheLine() {
    while (true) {
        if (LINE2_PIN.digitalRead(1) == 1 && LINE4_PIN.digitalRead(1) == 1) {
            forword();
        } else {
            findMiddle();
        }
        console.log("while");
    }
}

function findMiddle() {


    if (LINE3_PIN.digitalRead(1) == 0 && (LINE2_PIN.digitalRead(1) == 0 && LINE4_PIN.digitalRead(1) == 0)) {
        forword();
    }

    //when led 2 reach black line => turn left
    else if (LINE2_PIN.digitalRead(1) == 0) {
        console.log("led 2")
        turnleft()
            // if (LINE3_PIN.digitalRead(1) == 0) {
            //     doStuffAsync(pin_init())
            // }
    }


    //when led 4 reach black line => turn right
    else if (LINE4_PIN.digitalRead(1) == 0) {
        console.log("led 4");

        turnRight()
            // if (LINE3_PIN.digitalRead(1) == 0) {
            //     doStuffAsync(pin_init())
            // }
    }

}

console.log("==== PIN stat ====");
console.log("PWMA range: " + PWMA_PIN.getPwmRange());
console.log("PWMA freq: " + PWMA_PIN.getPwmFrequency());

console.log("PWMB range: " + PWMB_PIN.getPwmRange());
console.log("PWMB freq: " + PWMB_PIN.getPwmFrequency());

// var stopmotor;

function forword() {

    console.log("start forword");
    // ==== A ====
    PWMA_PIN.analogWrite(180);
    AIN1_PIN.digitalWrite(1);
    AIN2_PIN.digitalWrite(0);

    // ==== B ====
    PWMB_PIN.analogWrite(180);
    BIN1_PIN.digitalWrite(1);
    BIN2_PIN.digitalWrite(0);
}

function backword() {
    console.log("backword");
    // ==== A ====
    PWMA_PIN.analogWrite(180);

    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(1);

    // ==== B ====

    PWMB_PIN.analogWrite(180);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(1);
    console.log("back end")

}

function turnleft() {
    // // ==== A ====
    PWMA_PIN.analogWrite(180);

    AIN1_PIN.digitalWrite(1);
    AIN2_PIN.digitalWrite(0);

    //==== B ====
    PWMB_PIN.analogWrite(180);
    BIN1_PIN.digitalWrite(0);
    BIN2_PIN.digitalWrite(1);
}

function turnRight() {
    // // ==== A ====
    PWMA_PIN.analogWrite(180);

    AIN1_PIN.digitalWrite(0);
    AIN2_PIN.digitalWrite(1);

    //==== B ====
    PWMB_PIN.analogWrite(180);
    BIN1_PIN.digitalWrite(1);
    BIN2_PIN.digitalWrite(0);
}

function getValues() {
    console.log("led1: ", LINE1_PIN.digitalRead(1));
    console.log("led2: ", LINE2_PIN.digitalRead(1));
    console.log("led3: ", LINE3_PIN.digitalRead(1));
    console.log("led4: ", LINE4_PIN.digitalRead(1));
    console.log("led5: ", LINE5_PIN.digitalRead(1));
    console.log("________________________________________")
}






//

// 
// doStuffAsync();
// forword();
// setTimeout(function() {
//     pin_init();
// }, 100);

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    // pin_init();
    // followTheLine();

    socket.on('UP_ARROW', function() {
        console.log("UP_ARROW");
        forword();

    });
    socket.on('DOWN_ARROW', function() {
        console.log("DOWN_ARROW");
        backword();

    });
    socket.on('LEFT_ARROW', function() {
        console.log("LEFT_ARROW");
        turnleft();

    });
    socket.on('RIGHT_ARROW', function() {
        console.log("RIGHT_ARROW");
        turnRight();

    });
    socket.on('STOP_MOTOR', function() {
        console.log("stop motor");
        // forword();
        // pin_init();
    });
    socket.on('GET_DATA', function() {

        console.log("led1: ", LINE1_PIN.digitalRead(1));
        console.log("led2: ", LINE2_PIN.digitalRead(1));
        console.log("led5: ", LINE5_PIN.digitalRead(1));
    });

})
pin_init();
followTheLine();