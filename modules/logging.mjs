
import chalk from "chalk";
import { HTTPMethods }from "./httpCodes.mjs";
import fs from "fs/promises"

let COLORS = {}; 
COLORS[HTTPMethods.POST] = chalk.yellow;
COLORS[HTTPMethods.PATCH] = chalk.yellow;
COLORS[HTTPMethods.PUT] = chalk.yellow;
COLORS[HTTPMethods.GET] = chalk.green;
COLORS[HTTPMethods.DELETE] = chalk.red;
COLORS.Default = chalk.gray;

const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

//#endregion


class logger{ 


    static LOGGING_LEVELS = {
        ALL: 0,         
        VERBOSE: 5,     
        NORMAL: 10,     
        IMPORTANT: 100, 
        CRTICAL: 999    
    };

    #globalThreshold = logger.LOGGING_LEVELS.ALL;

    #loggers;

static instance = null;

    constructor() {
        if (logger.instance == null) {
        logger.instance = this;
        this.#loggers = [];
        this.#globalThreshold = logger.LOGGING_LEVELS.NORMAL;
        }
        return logger.instance;
    }

     static log(msg, logLevl = logger.LOGGING_LEVELS.NORMAL) {

        let logging = new logger();
        if (logging.#globalThreshold > logLevl) {
            return;
        }

    }
    
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: logger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {

        const threshold = options.threshold || logger.LOGGING_LEVELS.NORMAL;

        return (req, res, next) => {
            
            if (this.#globalThreshold > threshold) {
                return;
            }
           
            this.#LogHTTPRequest(req, res, next);
        }

    }

    #LogHTTPRequest(req, res, next) {
      
    let type = req.method;
    const path = req.originalUrl;
    const when = new Date().toLocaleTimeString();
   
        type = colorize(type);
        this.#writeToLog([when, type, path].join(" "));

        next();
    }

    #writeToLog(msg) {

        msg += "\n";
        console.log(msg);
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => { });
    }
}


export default logger