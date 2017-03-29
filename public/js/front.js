$(document).ready(function(){
    var email,pass;

    $("#sign-in").click(function(){
        email=$("#email-input").val();
        pass=$("#password-input").val();
        $.post('http://localhost:2000/', {email: email,pass: pass, button:1})
    });
    $("#sign-up").click(function(){
        email=$("#email-input").val();
        pass=$("#password-input").val();
        $.post('http://localhost:2000/', {email: email,pass: pass, button:0})
    });
});


 function createTask(){
    var taskName = document.getElementById('task-name');
    var taskDescription = document.getElementById('task-description');
    var taskDeadline = document.getElementById('task-deadline');
    console.log('Task name is ' + task-name.value + ' description is ' + task-description.value + ' and its due to ' + task-deadline.value);
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