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
                //Елементи, що додаються на головній сторінці
                        "<div class='task'>" +
                            "<h3>" + result[i].name + "</h3>" +
                            "<p>" + Date.parse(result[i].deadline) + '</p>' +
                            "<p>" + result[i].description + '</p>' +
                        "</div>" + 
                        "<div>"  +
                            "<a href='create.html' class='teamlead'>Create task</a>" + 
                        "</div>"
            );
        }
    }});

    $('.task').click(function(){
        $('p').css('display', 'block');
    });
    
    // Передача даних про користувача після авторизації або реєстрації
      $.ajax({url: 'user.json', success : function(result){
          $('#user-data').append('<span>' + result[0].login + '</span>');
        //   Відображення посилання на створення таску тімліду
          if (result[0].id_role != 2){
            $('.teamlead').css('display', 'none');
          }

        // Відключення посилань на форму створення таску для працівників
        if(result[0].id_role > 2){
              $('.button-header').css('display', 'none');
          }
      }});

    // Анімація на головній сторінці
});
