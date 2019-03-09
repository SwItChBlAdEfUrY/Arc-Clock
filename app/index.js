import clock from "clock";
import document from "document";
//import Console from "console"; //uncomment if using console
import { me as device } from "device";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";

//set the heart rate variable
let hrSens = new HeartRateSensor();
let body = new BodyPresenceSensor();

// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the elements
const timeText = document.getElementById("timeText");
const monthText = document.getElementById("monthText");
const dateText = document.getElementById("dateText");
const hrDisp = document.getElementById("hrDisp");
const heart = document.getElementById("heart");
const periodText = document.getElementById("period");

const secondRect = document.getElementById("secondRect");
const minuteArc = document.getElementById("minuteArc");
const hourArc = document.getElementById("hourArc");

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE",
  "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
];

var realDate = new Date();
var lastMin = 0;
var lastHour = 0;

timeText.x = device.screen.width/2;
timeText.y = (device.screen.height/2) + (20);

monthText.x = device.screen.width/2;
monthText.y = (device.screen.height/2) + (-85);

dateText.x = device.screen.width/2;
dateText.y = (device.screen.height/2) + (-45);

periodText.x = device.screen.width/2;
periodText.y = (device.screen.height/2) + (55);

hrDisp.x = (device.screen.width/2) + (20);
hrDisp.y = (device.screen.height/2) + (85);

heart.x = ((device.screen.width/2) - (heart.width/2)) + -20;
heart.y = ((device.screen.height/2) - (heart.height/2)) + 80;

minuteArc.x = ((device.screen.width/2) - (minuteArc.width/2));
minuteArc.y = ((device.screen.height/2) - (minuteArc.height/2));

hourArc.x = ((device.screen.width/2) - (hourArc.width/2));
hourArc.y = ((device.screen.height/2) - (hourArc.height/2));

if(preferences.clockDisplay === "24h"){
   periodText.fontSize = 0;
}


//<arc x="50%" y="50%" width="80" height="80" fill="cyan" arc-width="10" start-angle="0" sweep-angle="90" />
clock.ontick = (evt) => {
  //get todays' current hour minute and seccond
  let today = evt.date;
  let seconds = today.getSeconds();
  let hours = today.getHours() % 12 || 12;
  let mins = today.getMinutes();
  
  let secondLength = util.map(seconds, 0, 60, 0, device.screen.width);
  secondRect.width = secondLength;
  
  if(lastMin !== mins){
    onMin(mins, evt);
    lastMin = mins;
    
    //update the digital display
    timeText.text = `${util.zeroPad(hours)}:${util.zeroPad(mins)}`;
  }
  if(lastHour !== hours){
    onHour(hours, evt);
    lastHour = hours;
  }
}

//run every minute
function onMin(min, evt){
  //calculate and set the angle for the minute arc
  let minuteAngle = util.map(min, 0, 60, 0, 360);
  minuteArc.sweepAngle = minuteAngle;
  
  //determine the period
  if(evt.date.getHours() >= 12){
    periodText.text = "PM";
  }
  else{
    periodText.text = "AM";
  }
}

//run every hour
function onHour(hour, evt){
  //calculate and set the angle for the hour arc
  let hourAngle = util.map(hour, 0, 12, 0, 360);
  hourArc.sweepAngle = hourAngle;
  
  //get the month and day and set the display
  realDate = new Date();
  monthText.text = monthNames[realDate.getMonth()];
  dateText.text = util.zeroPad(realDate.getMonth() + 1) + " / " + util.zeroPad(realDate.getDate());
  
}

// on heart rate sensor change
hrSens.onreading = (evt) => {
  //console.log(hrSens.heartRate);
  //hrSens.heartRate
  hrDisp.text = hrSens.heartRate;
}

body.onreading = () => {
  if (!body.present) {
    //hrDisp.text = "00";
    hrSens.stop();
  } else {
    hrSens.start();
  }
};

hrSens.start();

