
function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
            return isOpen;
        },

        close: function () {
            isOpen = false;
            return isOpen;
        }
    }
}

const a = ( function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
            return isOpen;
        },

        close: function () {
            isOpen = false;
            return isOpen;
        }
    }
})();

const b = (iife)();

a.open();
b.close();
console.log(a.value());
console.log(b.value());

function toggle() {

}
