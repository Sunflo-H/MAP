function a() {
    console.log("실행");
    const element = document.getElementById('my_div');
    alert(element.innerHTML);
    // alert(element.innerText);
  } 
  
  function b() {
    const element = document.getElementById('my_div');
    alert(element.innerText);
  } 
  
  function getTextContent() {
    const element = document.getElementById('my_div');
    alert(element.textContent);
  } 