$(document).ready(function(){
    var email,pass;
    // Передача даних при логіні на сервер
    $("#sign-in").click(function(){
        email=$("#email-input").val();
        pass=$("#password-input").val();
        $.post('http://localhost:2000/', {email: email,pass: pass, button:1})
    });
    // Передача даних при реєстрації

    $("#sign-up").click(function(){
        email=$("#email-input").val();
        pass=$("#password-input").val();
        $.post('http://localhost:2000/', {email: email,pass: pass, button:0})
    });

    var task_name, task_description, task_deadline;
    // Передача даних при створенні таску
    $('#create_task').click(function(){
      task_name = $('#task-name').val();
      task_description = $('#task-description').val();
      task_deadline = $('#task-deadline').val();
      $.post('http://localhost:2000/create-task', {name: task_name, description: task_description, deadline: task_deadline})
      window.location.href="http://localhost:2000/index";
    });
    
    // Прийом даних з серверу і вивід на сторінку у вигляді посилань
    $.ajax({url: 'data.json', success : function(result){
        for(i=0; i <= result.length; i++){
            $('.content').append(
                "<span class='task-head'>" + result[0].name + "</span>" +
                        "<div class='task-info'>" +
                            "<h3>" + result[i].name + "</h3><br>" +
                            "<p>" + Date.parse(result[i].deadline) + '</p>' +
                            "<p>" + result[i].description + '</p>' +
                        "</div>"
            );
        }
    }});
    // Передача даних про користувача після авторизації або реєстрації
      $.ajax({url: 'user.json', success : function(result){
          $('#user-data').append('<span>' + result[0].login + '</span>');

      }});

    // Анімація на головній сторінці

});



// Хай поки шо буде тут
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
