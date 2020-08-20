module.exports = {
    "extends": [
        "eslint:recommended"
    ],
    "parser": "babel-eslint",
    "env": {
        "amd": true, //require
        "node": true, //module
        "es6": true, //Promise
    },
    "rules": {
        "no-console": "off"
    }
};