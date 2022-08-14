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

const b = ( function iife() {
    let isOpen;

    return {
        value: function () {
            return isOpen;
        },

        open: function () {
            isOpen = true;
        },

        close: function () {
            isOpen = false;
        }
    }
})();

a.open();
b.close();
console.log(a.value());
console.log(b.value());

function toggle() {

}

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