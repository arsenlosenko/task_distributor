$(document).ready(function(){
    var email,pass;

    $("#sing-in").click(function(){
        email=$("#emailInput").val();
        pass=$("#passwordInput").val();
        $.post('http://localhost:2000/', {email: email,pass: pass})
    });
});
 

 function createTask(){
    var taskName = document.getElementById('taskName');
    var taskDescription = document.getElementById('taskDescription');
    var taskDeadline = document.getElementById('taskDeadline');
    console.log('Task name is ' + taskName.value + ' description is ' + taskDescription.value + ' and its due to ' + taskDeadline.value);
    return false;
}

function createEl(){
    var textNode = prompt('Add text: ');
    var container = document.getElementById('tasks');
    var paragraph = document.createElement('p');
    var anchor = document.createElement('a');
    var text = document.createTextNode(textNode);
    paragraph.appendChild(anchor);
    anchor.appendChild(text);       
    container.appendChild(paragraph);
}

//скрипт для тесту переходу на індекс
// function changePage(){
//     window.location.href = "../views/index.html";
//     var email = document.getElementById('emailInput');
//     var pass = document.getElementById('passwordInput');
//     console.log('Login is ' + email.value + ' and password is ' + pass.value);
//     return false;

// }