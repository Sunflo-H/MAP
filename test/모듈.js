function func() {
    var private = 0;
    return function() {
        private++;
        return private;
    }
}
var val = func();
console.log(val()); // 1
console.log(val()); // 2
console.log(val());