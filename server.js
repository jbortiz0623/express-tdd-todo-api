// require express and other modules
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
let todos = [
  { _id: 7, task: 'Laundry', description: 'Wash clothes' },
  { _id: 27, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 44, task: 'Homework', description: 'Make this app super awesome!' }
];

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * Response Endpoints
 */

// Search //
app.get('/api/todos/search', (req, res) => {
  // save the query to a variable
  let searchTerm = req.query.q;
  // filter the todos array based on the query and save to a variable
  let filteredTodos = todos.filter((todo) => {
    return(
      todo.task.toLowerCase().includes(searchTerm.toLowerCase()) || todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });
  // send the filtered array as a json response
  res.json({data : filteredTodos});
});

// Index //
app.get('/api/todos', (req, res) => {
  //send the todos array as a json response
  res.json({data:todos});
});


// Show //
app.get('/api/todos/:id', (req, res) => {
  // grab the param and save it to a variable
 let paramId = parseInt(req.params.id)
 // get the index of the todo with the paramId and save it to a variable
 let index = todos.findIndex(todo => todo._id == paramId)
 // send a json response of todo with the given index
 res.json(todos[index])
});

// Update //
app.put('/api/todos/:id', (req, res) => {
  // grab the param and save it to a variable
  let paramId = parseInt(req.params.id)
  // get the index of the todo with the paramId and save it to a variable
  let index = todos.findIndex(todo => todo._id == paramId)
  // with that given index access the todo and update it with the given information from req.body
  todos[index].description = req.body.description
  todos[index].task = req.body.task
  // respond with the updated todo
  res.json(todos[index])
});

// Create
app.post('/api/todos', (req, res) => {
  //save the req.body object as a variable
  newTodo = req.body
  //add an _id key that is the length + 1 according to the testing
  newTodo._id = todos.length + 1
  // put the new todo in the todos array
  todos.push(newTodo);
  // respond with the new todo
  res.json(newTodo);
});

// Destroy
app.delete('/api/todos/:id', (req, res) => {
  // grab the param and save it to a variable
  let paramId = parseInt(req.params.id)
  // get the index of the todo with the paramId and save it to a variable
  let index = todos.findIndex(todo => todo._id == paramId)
  // remove that index from the array
  todos.splice(index,1)
  // respond with a success
  res.json(`success removed`)
});

//Run server and run on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
