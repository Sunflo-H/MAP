var Module = function() {

  var privateKey = 0;
  function privateMethod() {
      return privateKey++;
  }

  return {
      publicKey: privateKey,
      publicMethod: function() {
          return privateMethod();
      }
  }

}

var obj1 = Module();
console.log(obj1.publicMethod()); // 1
console.log(obj1.publicMethod()); // 2

var obj2 = Module();
console.log(obj2.publicMethod()); // 1
console.log(obj2.publicMethod()); // 2

console.log(obj1 === obj2);