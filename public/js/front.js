       $(document).ready(function(){
            var user,pass;
           console.log("js loaded!");
        $("#sign-in").click(function(){
            user=$("#emailInput").val();
            pass=$("#passwordInput").val();
            $.post("http://localhost:2000/",{user: user,password: pass}, function(data){
            if(data==='done')
              {
                alert("login success");
              }
          });
        });
      });
 

 function createTask(){
    let taskName = document.getElementById('taskName');
    let taskDescription = document.getElementById('taskDescription');
    let taskDeadline = document.getElementById('taskDeadline');
    console.log('Task name is ' + taskName.value + ' description is ' + taskDescription.value + ' and its due to ' + taskDeadline.value);
    return false;
}

function createEl(){
    let textNode = prompt('Add text: ');
    let container = document.getElementById('tasks');
    let paragraph = document.createElement('p');
    let anchor = document.createElement('a');
    let text = document.createTextNode(textNode);
    paragraph.appendChild(anchor);
    anchor.appendChild(text);       
    container.appendChild(paragraph);
}

//скрипт для тесту переходу на індекс
// function changePage(){
//     window.location.href = "../views/index.html";
//     let email = document.getElementById('emailInput');
//     let pass = document.getElementById('passwordInput');
//     console.log('Login is ' + email.value + ' and password is ' + pass.value);
//     return false;

// }