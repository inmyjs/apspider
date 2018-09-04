"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var fs = require("fs");
function _default(log, type) {
    var filename = "" + moment().format("YYYY_MM_DD") + (type
        ? "_" + type
        : "") + ".txt";
    log = "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] " + log.toString() + "\n\n";
    fs.writeFile("./logs/" + filename, log, { flag: "a" }, function () {
        // ignore
    });
}
exports.default = _default;
