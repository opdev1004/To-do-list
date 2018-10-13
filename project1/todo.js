var ERROR_LOG = console.error.bind(console);
//var URL = "http://localhost:8080/";
var URL = "";

$(document).ready(function(e) {
  reloadToDoList();
  var $taskItem = null;
  $('#add-todo').button({
    icons: { primary: "ui-icon-circle-plus" }}).click(
      function() {
        $('#new-todo').dialog('open');
  });

  $('#new-todo').dialog({
  modal : true, autoOpen : false,
  buttons : {
    "Add task" : function () {
      var taskName = $('#task').val();
      //var userName = $('#user').val();
      $('#task').val('');
      //$('#user').val('');
      if (taskName === '') { return false; }
      //if (userName === '') { return false; }
      $('#task').val('');
      $.ajax({
        method: 'POST',
        url: URL + 'new-task',
        data: JSON.stringify({
          completed: "0",
          task: taskName,
          username: ""
        }),
        contentType: "application/json",
        dataType: "json"
      }).then(reloadToDoList(), ERROR_LOG);
      $(this).dialog('close');
  },
  "Cancel" : function () { $(this).dialog('close'); }
  }
  });


  $('#todo-list').on('click', '.done', function() {
    $taskItem = $(this).parent('li');
    var completed = "0";
    var taskName = $taskItem.find('.task').text();
    var userName = $taskItem.find('.user').text();
    $.ajax({
      method: 'PUT',
      url: URL + 'done-task',
      data: JSON.stringify({
        completed: completed,
        task: taskName,
        username: userName
      }),
      contentType: "application/json",
      dataType: "json"
    }).then(reloadToDoList(), ERROR_LOG);
  });



  $('.sortlist').on('click','.delete',function() {
    $taskItem = $(this).parent('li');
    $('#confirm-deletion').dialog('open');
  });

  $('#confirm-deletion').dialog({
    modal : true, autoOpen : false,
    buttons : {
      "Confirm" : function () {
        var completed;
        if($taskItem.parent().attr('id') == 'todo-list') completed = "0";
        else completed = "1";
        var taskName = $taskItem.find('.task').text();
        var userName = $taskItem.find('.user').text();
        $.ajax({
          method: 'DELETE',
          url: URL + 'delete-task',
          data: JSON.stringify({
            completed: completed,
            task: taskName,
            username: userName
          }),
          contentType: "application/json",
          dataType: "json"
        }).then(reloadToDoList(), ERROR_LOG);
        $(this).dialog('close');
      },
      "Cancel" : function () { $(this).dialog('close'); }
    }
  });



  $('.sortlist').on('click','.edit',function() {
    $taskItem = $(this).parent('li');
    $('#edit-item').dialog('open');
  });

  $('#edit-item').dialog({
    modal : true, autoOpen : false,
    buttons : {
      "Confirm" : function () {
        var newTaskName = $('#editTask').val();
        var newUserName = $('#editUser').val();
        $('#editTask').val('');
        $('#editUser').val('');
        if (taskName === '') { alert('Name of task cannnot be empty.'); return false; }
        if (userName === '') { alert('Name of user cannnot be empty.'); return false; }
        var completed = "0";
        var taskName = $taskItem.find('.task').text();
        var userName = $taskItem.find('.user').text();
        $.ajax({
          method: 'PUT',
          url: URL + 'edit-task',
          data: JSON.stringify({
            completed: completed,
            task: taskName,
            username: userName,
            newTaskName: newTaskName,
            newUserName: newUserName
          }),
          contentType: "application/json",
          dataType: "json"
        }).then(reloadToDoList(), ERROR_LOG);
        $(this).dialog('close');
      },
      "Cancel" : function () { $(this).dialog('close'); }
    }
  });

  function reloadToDoList(){
    $.ajax({
      method: 'GET',
      url: URL + 'get-all'
    }).then(addItems, ERROR_LOG);
  }

  function addItems(jData){
    var jsonData = jData;
    if(jsonData[0].task == null) return;
    // empty the list
    $('#todo-list').empty();
    $('#completed-list').empty();
    for(var i = 0; i < jsonData.length; i++){
      if(jsonData[i].completed == 0){
        var taskHTML = '<li><span class="done">%</span>';
        taskHTML += '<span class="delete">x</span><span class="edit">e</span>';
        taskHTML += '<span class="task"></span><span class="user"></span></li>';
        var $newTask = $(taskHTML);
        $newTask.find('.task').text(jsonData[i].task);
        $newTask.find('.user').text(jsonData[i].username);
        $newTask.hide();
        $('#todo-list').prepend($newTask);
        $newTask.show('clip',250).effect('highlight',1000);
        $('.sortlist').sortable({
          connectWith : '.sortlist',
          cursor : 'pointer',
          placeholder : 'ui-state-highlight',
          cancel : '.delete,.done,.edit'
        });
      } else {
        var taskHTML = '<li><span class="done">%</span>';
        taskHTML += '<span class="delete">x</span>';
        taskHTML += '<span class="task"></span><span class="user"></span></li>';
        var $newTask = $(taskHTML);
        $newTask.find('.task').text(jsonData[i].task);
        $newTask.find('.user').text(jsonData[i].username);
        $newTask.hide();
        $('#completed-list').prepend($newTask);
        $newTask.show('clip',250).effect('highlight',1000);
        $('.sortlist').sortable({
          connectWith : '.sortlist',
          cursor : 'pointer',
          placeholder : 'ui-state-highlight',
          cancel : '.delete,.done,.edit'
        });
      }
    }
  }

}); // end ready
