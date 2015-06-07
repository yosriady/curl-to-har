var _ = require('underscore');
var s = require("underscore.string");
var parse = require('shell-quote').parse;

var FLAG_CHAR = "-";
var ARGUMENT_MAP = {
    "request": "method"
}

// Helper methods
Array.prototype.chunk = function(chunkSize) {
    var array=this;
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
        })
    );
}

function parseQueryString(url){
    var hashes = [];
    var qs = url.slice(url.indexOf("?")).slice(1);
    if (!_.isEmpty(qs)){
        _.each(qs.split("&"), function(pair){
            hashes.push({
                name: pair.split("=")[0],
                value: pair.split("=")[1]
            });
        });
    }
    return hashes;
}

function buildHAR(args){
    var har = {
        "method": "GET",
        "url": "",
        "httpVersion": "HTTP/1.1",
        "queryString" : [],
        "headers": [],
        "cookies": [],
        "postData" : {}
    }

    // Handle url as first argument without --url flag
    if (args[0][0] !== FLAG_CHAR){
        args.unshift("--url");
    }

    argument_pairs = args.chunk(2);
    _.each(argument_pairs, function(elem, idx, l){
        var key = elem[0].slice(FLAG_CHAR.length).toLowerCase();
        var value = elem[1];
        if(!_.isEqual(elem[0].substring(0,FLAG_CHAR.length), FLAG_CHAR)){
            console.log("Missing flag char(--) from argument " + elem[0]);
            return;
        }
        switch(key) {
            case "-url":
                har['url'] = value.substring(0, value.indexOf("?")) || value
                har['queryString'] = parseQueryString(value);
                break;
            case "h":
            case "-header":
                har['headers'].push({
                    name: value.split(":")[0].trim(),
                    value: value.split(":")[1].trim()
                })
                break;
            case "-cookie":
                var cookies = [];
                _.each(value.split("; "), function(element){
                    cookies.push({
                        name: element.split("=")[0],
                        value: element.split("=")[1]
                    });
                })
                har['cookies'] = cookies;
                break;
            case "d":
            case "-data":
                har['postData'] = {
                    "mimeType": "application/json",
                    "text" : JSON.parse(value)
                }
                break;
            case "x":
            case "-request":
                har['method'] = value
                break;
            default:
                har[ARGUMENT_MAP[key]] = value
                break;
        }
    });
    return har;
}

function curlToHAR(str) {
    var tokens = parse(str);
    var cmd = tokens[0];
    if (cmd !== "curl") {
        console.log("Invalid curl command");
        return;
    }
    var args = tokens.slice(1);
    if (args.length % 2 !== 0 && !args[1][0] == FLAG_CHAR) {
        console.log("Invalid number of arguments");
        return;
    }
    return buildHAR(args);
}

module.exports = curlToHAR;