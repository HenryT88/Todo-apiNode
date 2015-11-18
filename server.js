var bodyParser = require('body-parser');
var _ = require('underscore');
var express = require('express');


var app = express();
app.use(bodyParser.json());


var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

//********************************
//DELETE
//********************************

app.delete('/todos/:id', function(req, res)
{
	var todoId = parseInt(req.params.id);
	var match = _.findWhere(todos, {id:todoId});
	
	
	if(match)
	{
		console.log('Deleted:');
		console.log(match);
		todos = _.without(todos,match);
		res.status(200).send(match);
		
	}
	else
	{
		res.status(404).send();
	}
});


//********************************
//POST
//********************************
app.post('/todos', function(req,res)
{
	var body = _.pick(req.body,'description', 'completed');
	console.log('description: ' + body.description);
	body.id = todoNextId;
	body.description = body.description.trim();
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		return res.status(400).send();
	}
	
	
	res.json(body);
	todos.push(body);
	todoNextId +=1;
});


//********************************
//GETS
//********************************
app.get('/', function(req,res)
{
	res.send('Todo API Root');
});

app.get('/todos', function(req, res)
{
	res.json(todos);
});

app.get('/todos/:id', function(req,res)
{		
	var todoId = parseInt(req.params.id);
	var match = _.findWhere(todos, {id:todoId});
	
	
	if(match)
	{
		console.log(match);
		res.json(match);
	}
	else
	{
		res.status(404).send();
	}
	
	
});

//********************************
//LISTEN
//********************************
app.listen(port, function()
{
	console.log('express listening on PORT ' + port);
});
