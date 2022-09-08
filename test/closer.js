// let f = function () {
//     let abc = 123;
//     let ddd = function() {
//         return abc;
//     }
//     return ddd;
// }
// let ccc = f();
// console.log(ccc());

function person(name,age){
	this.name = name;
	this.age = age;
    console.log(name, age);
}

var person1 = new person('hbj',28);


function Person(name,age) {
    name;
    this.age = age;
    console.log(name, age);
}

let p = new Person('hbja', 29);
Person('hb',30);

function a(a1, a2) {
    this.a1 = a1;
    a2
    
    return a1 + a2;
}

console.log( a(1, 2) ); // 3