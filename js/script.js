// Select everything
const todoForm = document.querySelector('form');
const todoInput = document.querySelector('form input');
const todoItemsList = document.querySelector('ul');
let todos = [];

// Function to add event listener on form/listen for submit
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
});

// Function to render todos
const renderTodos = (todos) => {
  todoItemsList.innerHTML = "";

  const completedTodos = [];
  const activeTodos = [];

  todos.forEach((item) => {
    const checked = item.completed ? 'checked' : null;
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      <span>${item.name}</span>
      <i class="fa fa-trash delete-button"></i>
    `;

    if (item.completed) {
      li.classList.add('checked');
      completedTodos.push(li);
    } else {
      activeTodos.push(li);
    }
  });

  // Append active todos first, then completed todos
  activeTodos.forEach((li) => {
    todoItemsList.appendChild(li);
  });

  completedTodos.forEach((li) => {
    todoItemsList.appendChild(li);
  });
};

// Function to add todos to local storage
const addToLocalStorage = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// Function to retreive data from local storage and render todos
const getFromLocalStorage = () => {
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
};

// Function to update local storage with the new order
const updateLocalStorageOrder = () => {
  const updatedOrder = [];
  const liItems = todoItemsList.querySelectorAll('li');

  liItems.forEach((li) => {
    const id = li.getAttribute('data-key');
    const todo = todos.find((item) => item.id.toString() === id);
    if (todo) {
      updatedOrder.push(todo);
    }
  });

  todos = updatedOrder;
  addToLocalStorage(todos);
};

// Function to toggle value as completed/not completed
const toggle = (id) => {
  todos.forEach((item) => {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
  renderTodos(todos); // Add this line to re-render the updated list immediately
};

// Function to add todo item
const addTodo = (item) => {
  if (item !== "") {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    todos.push(todo);
    addToLocalStorage(todos);
    renderTodos(todos); // Add this line to re-render the updated list
    todoInput.value = "";
  }
};

// Function to delete todo from array, and then update localstorage/rerender
const deleteTodo = (id) => {
  // Filter out the todo with the matching id and update the todos array
  todos = todos.filter((item) => item.id != id);

  // Update localstorage and re-render the updated list
  addToLocalStorage(todos);
  renderTodos(todos);
};

// Run func to get everything from local storage and render todos
getFromLocalStorage();

// Add event listener to the <ul> for checkbox and delete
todoItemsList.addEventListener('click', (e) => {
  if (e.target.type === 'checkbox') {
    toggle(e.target.parentElement.getAttribute('data-key'));
  }

  if (e.target.classList.contains('delete-button')) {
    deleteTodo(e.target.parentElement.getAttribute('data-key'));
  }
});

// Enable sortable functionality and update local storage after reordering
$(function() {
  $("#sortable").sortable({
    update: updateLocalStorageOrder
  });
});
