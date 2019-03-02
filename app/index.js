import clock from "clock";
import document from "document";
//import Console from "console"; //uncomment if using console
import { me as device } from "device";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the elements
const timeText = document.getElementById("timeText");
const monthText = document.getElementById("monthText");
const dateText = document.getElementById("dateText");

if(preferences.clockDisplay === "12h"){
   const periodText = document.getElementById("period");
}


const secondRect = document.getElementById("secondRect");
const minuteArc = document.getElementById("minuteArc");
const hourArc = document.getElementById("hourArc");

timeText.x = device.screen.width/2;
timeText.y = (device.screen.height/2) + (20);

monthText.x = device.screen.width/2;
monthText.y = (device.screen.height/2) + (20);

dateText.x = device.screen.width/2;
dateText.y = (device.screen.height/2) + (20);

periodText.x = device.screen.width/2;
periodText.y = (device.screen.height/2) + (55);

minuteArc.x = ((device.screen.width/2) - (minuteArc.width/2));
minuteArc.y = ((device.screen.height/2) - (minuteArc.height/2));

hourArc.x = ((device.screen.width/2) - (hourArc.width/2));
hourArc.y = ((device.screen.height/2) - (hourArc.height/2));

// Update the <text> element every tick with the current time
//<arc x="50%" y="50%" width="80" height="80" fill="cyan" arc-width="10" start-angle="0" sweep-angle="90" />
clock.ontick = (evt) => {
  
  let today = evt.date;
  //let month = today.getMonth();
  //let day = today.getDay();
  let seconds = today.getSeconds();
  let hours = today.getHours() % 12 || 12;
  let hours1224 = today.getHours();
  let mins = today.getMinutes();
  
  var secondLength = util.map(seconds, 0, 60, 0, device.screen.width);
  var minuteAngle = util.map(mins, 0, 60, 0, 360);
  var hourAngle = util.map(hours, 0, 12, 0, 360);
  
  secondRect.width = secondLength;
  minuteArc.sweepAngle = minuteAngle;
  hourArc.sweepAngle = hourAngle;
  

  if(today.getHours() >= 12){
    periodText.text = "PM";
  }
  else{
    periodText.text = "AM";
  }

  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours1224 = hours1224 % 12 || 12;
  } else {
    // 24h format
    hours1224 = util.zeroPad(hours1224);
  }
  
  timeText.text = `${util.zeroPad(hours1224)}:${util.zeroPad(mins)}`;
  //console.log(month + " " + day);
}
