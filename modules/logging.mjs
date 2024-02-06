import express from 'express' 
import chalk from "chalk";
import {HTTPMethods, HttpCodes  }from "./httpCodes.mjs";

const LOGGING_LEVELS = {
    mehhh:0,
    medium: 10, 
    import:100
}


class logger{ 

static #instance = null;
    constructor(){
        if (logger.#instance = null){
        logger.#instance = this
        }

        return logger.#instance
    }

    static currentLogThresholdValue = LOGGING_LEVELS.mehhh 

    log(req, res, next){

 
    if (currentLogThresholdValue) return;


    let type = req.method;
    const path = req.originalUrl;
    const when = new Date().toLocaleTimeString();

    if (type === HTTPMethods.POST){
        type = chalk.yellow(type);
    }else if (type === HTTPMethods.GET){
        type = chalk.green(type)
    }

    console.log(type, path);
    next();
}
}
export default logger