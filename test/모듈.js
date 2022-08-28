// const axios = require('axios');
// const cheerio = require('cheerio');

// calc.js 파일에서
function Add(num1, num2) {
    return num1 + num2;
}

function Multiply(num1, num2) {
    return num1 * num2;
}

define([], function () {
    let a = 1;
    let b = 10;


    function add(a, b) {
        return a + b;
    }

    function increase() {
        a++;
    }

    function get() {
        return a;
    }

    return {
        increase: increase,
        get: get
    }
});


// export {
//     Add,
//     Multiply
// };