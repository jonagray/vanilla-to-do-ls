// select everything

// select the to-do form
const todoForm = document.querySelector('form');

// select input box
const todoInput = document.querySelector('form input');

// select <ul>
const todoItemsList = document.querySelector('ul');

// storage array
let todos = [];

// function to add event listener on form/listen for submit
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
});

// function to add todo item
const addTodo = (item) => {
  if (item !== "") {
    // make a todo object
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // add it to the todos array
    todos.push(todo);
    addToLocalStorage(todos); // this will render them inside the <ul>

    // clear input box
    todoInput.value = "";
  }
};

// function to render todos
const renderTodos = (todos) => {
  todoItemsList.innerHTML = "";

  // loop through each item inside todos
  todos.forEach((item) => {
    // check if item has been completed or not
    const checked = item.completed ? 'checked' : null;

    // make <li> element and fill it
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);
    if (item.completed) {
      li.classList.add('checked');

      li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      <span>${item.name}</span>
      <i class="fa fa-trash delete-button"></i>
      `;
  
      todoItemsList.append(li);
    } else {
      li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      <span>${item.name}</span>
      <i class="fa fa-trash delete-button"></i>
      `;
  
      todoItemsList.prepend(li);
    }

  });
}

// function to add todos to local storage
const addToLocalStorage = (todos) => {

  // convert the array to a string, and then store it
  localStorage.setItem('todos', JSON.stringify(todos));

  // render to screen
  renderTodos(todos);
};

// function to retreive data from local storage
const getFromLocalStorage = () => {
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// function to toggle value as completed/not completed
const toggle = (id) => {
  todos.forEach((item) => {
    // using == instead of === because types are different (num vs str)
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
};

// Function to delete todo from array, and then update localstorage/rerender
const deleteTodo = (id) => {
  // filter out <li> with id
  todos = todos.filter((item) => {
    return item.id != id;
  });

  // update localstorage
  addToLocalStorage(todos);
};

// run func to get everything from local storage
getFromLocalStorage();

// add event listener to the <ul> for checkbox and delete
todoItemsList.addEventListener('click', (e) => {
  if (e.target.type === 'checkbox') {
    // toggle the state
    toggle(e.target.parentElement.getAttribute('data-key'));
  }

  // check if deleting
  if (e.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where delete-button is present
    deleteTodo(e.target.parentElement.getAttribute('data-key'));
  }
});

$(function() {
  $("#sortable").sortable();
});
