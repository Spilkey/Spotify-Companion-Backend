const dotenv = require('dotenv');
dotenv.config();

var logLevel = process.env.LOG_LEVEL;

// define log levels
let logs = ["debug", "info", "notice", "error"];

function padNumber(number){
    let numberString = number.toString(); 
    if (numberString.length < 2){
        let numberNew = '0' + numberString;
        return numberNew;
    } 
    return number
}

function formatDate() {
    var today = new Date(),
        month = padNumber(today.getMonth() + 1),
        day = padNumber(today.getDate()),
        year = today.getFullYear(),
        hours = padNumber(today.getHours()), 
        mins = padNumber(today.getMinutes()),
        seconds = padNumber(today.getSeconds())

        return [year, month, day].join('-') +" "+ [hours, mins, seconds].join(':');
}

function logger(content, type){
    
    let logMask;
    // determine bitmask for which logs we show
    switch (logLevel) {
        case 'debug':
            logMask = 4;
            break;
        case 'info':
            logMask = 3;
            break;
        case 'notice':
            logMask = 2;
            break;
        case 'error':
            logMask = 1;
            break;
        default:
            logMask = 0;
            break;
    }

    // filter array for accepted logs 
    let acceptedLogs = (logs.length !== logMask) ? logs.splice(0, logs.length - logMask) : logs;
    
    if(acceptedLogs.includes(type)){
        let date = formatDate();
        let output = `[${date}] [${type.toUpperCase()}] - ${content}`;
        console.log(output);
    }
}

exports.debug = (content) => {logger(content, 'debug')}
exports.info = (content) => {logger(content, 'info')}
exports.notice = (content) => {logger(content, 'notice')}
exports.error = (content) => {logger(content, 'error')}