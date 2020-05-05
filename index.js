/** - emoji codes -
 * :sunny:
 * :white_sun_cloud:
 * :white_sun_rain_cloud:
 * :white_sun_small_cloud:
 * :cloud_rain:
 * :thunder_cloud_rain:
 * :cloud_snow:
 * :cloud:
 * :cloud_tornado:
 * :cloud_lightning:
 * :thermometer:
 */
var key = require("./keys.js");
const Discord = require("discord.js");
const bot = new Discord.Client();
const https = require('https');
const axios = require('axios');
var _ = require('lodash');
var moment = require('moment');

const mainURL = 'https://api.weatherapi.com/v1/current.json'; // &q=Athens
const weatherKey = "key=" + key.weatherapi;
const botName = "TestBot_Tutorial";

// variables
var _message = {};

// some mappings from: https://www.weatherapi.com/docs/conditions.json
const weatherLookupTable = {
    "1000": ":sunny:",
    "1003": ":white_sun_cloud:",
    "1006": ":cloud:",
    "1063": ":white_sun_rain_cloud:",
    "1009": ":white_sun_small_cloud:",
    "1066": ":cloud_snow:",
    "1087": ":cloud_lightning:",
    "1117": ":cloud_snow:",
    "1180": ":white_sun_rain_cloud:",
    "1183": ":cloud_rain:",
    "1186": ":cloud_rain:",
    "1189": ":cloud_rain:",
    "1192": ":thunder_cloud_rain:",
    "1195": ":thunder_cloud_rain:",
    "1210": ":cloud_snow:",
    "1213": ":cloud_snow:",
    "1219": ":cloud_snow:",
    "1222": ":cloud_snow:",
    "1225": ":cloud_snow:",
    "1273": ":thunder_cloud_rain:",
    "1276": ":thunder_cloud_rain:",
    "1279": ":thunder_cloud_rain:",
    "1246": ":cloud_tornado:"
};

console.log("starting weather bot...");

// add event listener when a message is received //
bot.on("message", (message) => {
    console.log(message);
    _message = message;
    if (message.author.username === botName) {
        return;
    }

    if (message.content === "ping") {
        message.channel.send("pong");
    } else if (message.content === "-help") {
        message.channel.send("```Available Commands:\n-help <Help list>\nping <test>\nweather <US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree) or city name> (e.g: weather Athens)\n```");
    } else if (message.content.indexOf("weather") !== -1) {
        let params = message.content.split("in");
        let queryParameter = params[1].trim();

        message.channel.startTyping();
        fetchWeatherConditions(queryParameter, (result) => {
            let weather = parseWeatherConditions(result);

            let temperature = result["current"].temp_c + "℃" + " - " + result["current"].temp_f + "℉";
            message.channel.send("The weather currently is: " + weather + " and the :thermometer:" + temperature);
            message.channel.stopTyping();
        });
    } else {
        message.channel.send("Nothing found, make sure you use proper commands, for help type -help");
    }

});

/**
 *
 *
 * @param {*} data - the weather data response
 * @returns
 */
function parseWeatherConditions(data) {
    return weatherLookupTable[String(data["current"]["condition"].code)];
}

/**
 *
 *
 * @param {*} queryParameter - The city or other condition to search the weather API for
 * @param {*} callback - A function to receive our response
 */
function fetchWeatherConditions(queryParameter, callback) {
    const options = {
        hostname: mainURL,
        path: "?" + weatherKey + "&q=" + escape(queryParameter),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    console.log(options.hostname + options.path);

    axios.get(options.hostname + options.path)
        .then(response => {

            if (callback) {
                callback(response.data);
            }

        })
        .catch(error => {
            console.log(error);
            _message.channel.stopTyping();
        });
}

bot.login(key.key);