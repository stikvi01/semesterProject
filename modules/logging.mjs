
import chalk from "chalk";
import { HTTPMethods }from "./httpCodes.mjs";
import fs from "fs/promises"

//#region  Construct for decorating output.

let COLORS = {}; // Creating a lookup tbl to avoid having to use if/else if or switch. 
COLORS[HTTPMethods.POST] = chalk.yellow;
COLORS[HTTPMethods.PATCH] = chalk.yellow;
COLORS[HTTPMethods.PUT] = chalk.yellow;
COLORS[HTTPMethods.GET] = chalk.green;
COLORS[HTTPMethods.DELETE] = chalk.red;
COLORS.Default = chalk.gray;

// Convenience function
// https://en.wikipedia.org/wiki/Convenience_function
const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

//#endregion


class logger{ 


    static LOGGING_LEVELS = {
        ALL: 0,         // We output everything, no limits
        VERBOSE: 5,     // We output a lott, but not 
        NORMAL: 10,     // We output a moderate amount of messages
        IMPORTANT: 100, // We output just siginfican messages
        CRTICAL: 999    // We output only errors. 
    };

     // What level of messages should we be logging.
    // This field is static 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
    #globalThreshold = SuperLogger.LOGGING_LEVELS.ALL;

    // Structure to keep the misc log functions that get created.
    // This field is private.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
    #loggers;

    //#region Using a variation on the singelton pattern
    // https://javascriptpatterns.vercel.app/patterns/design-patterns/singleton-pattern
    // This field is static 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
static instance = null;

    constructor() {
            // This constructor will allways return a refrence to the first instance created. 
        if (logger.instance == null) {
        logger.instance = this;
        this.#loggers = [];
        this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        return logger.instance;
    }
     //#endregion

     static log(msg, logLevl = logger.LOGGING_LEVELS.NORMAL) {

        let logging = new logger();
        if (logging.#globalThreshold > logLevl) {
            return;
        }

        //logging.#writeToLog(msg);
    }
    

    // This is our automatic logger, it outputs at a "normal" level
    // It is just a convinent wrapper around the more generic createLimitedRequestLogger function
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: logger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {

        // if no level is threshold, we default to NORMAL.
        // We are using the logical or (||) 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#logical_operators
        const threshold = options.threshold || logger.LOGGING_LEVELS.NORMAL;

        // Returning an anonymous function that binds local scope.
        return (req, res, next) => {

            // If the threshold provided is less then the global threshold, we do not logg
            if (this.#globalThreshold > threshold) {
                return;
            }

            // Finaly we parse our request on to the method that is going to writ the log msg.
            this.#LogHTTPRequest(req, res, next);
        }

    }

    #LogHTTPRequest(req, res, next) {
        // These are just some variables that we extract to show the point 
        // TODO: Extract and format information important for your dev process.
    let type = req.method;
    const path = req.originalUrl;
    const when = new Date().toLocaleTimeString();
   
        // TODO: This is just one simple thing to create structure and order. Can you do more?
        type = colorize(type);
        this.#writeToLog([when, type, path].join(" "));

        // On to the next handler function
        next();
    }

    #writeToLog(msg) {

        msg += "\n";
        console.log(msg);
        ///TODO: The files should be based on current date.
        // ex: 300124.log
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => { });
    }
}


export default logger