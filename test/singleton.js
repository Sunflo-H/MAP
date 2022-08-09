const Counter = (function counterIIFE() {
    // 현재 counter 값을 저장하기 위한 변수
    let current = 0;
    console.log(current);

    return {
        getCurrentValue: function () {
            return current;
        },

        increaseValue: function () {
            current = current + 1;
            return current;
        },

        decreaseValue: function () {
            current = current - 1;
            return current;
        },
    };
})();

console.log(Counter.getCurrentValue()); // 0
console.log(Counter.increaseValue()); // 1
console.log(Counter.decreaseValue()); // 0
console.log(Counter.decreaseValue()); // 0
console.log(Counter);