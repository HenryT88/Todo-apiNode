var bodyParser = require('body-parser');
var _ = require('underscore');
var express = require('express');


var app = express();
app.use(bodyParser.json());


var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;


//********************************
//PUT   (UPDATE A TODO)
//********************************
app.put('/todos/:id', function(req,res)
{
	var todoId = parseInt(req.params.id);
	var match = _.findWhere(todos, {id:todoId});
	
	var body = _.pick(req.body,'description', 'completed');
	var validAttributes = {};
	
	if(!match)
	{
		return res.status(400).send();
		//RUN RETURN AS IT STOPS EXTRA CODED EXECUTING
	}
	
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
	{
		validAttributes.completed = body.completed;
	}
	else if (body.hasOwnProperty('completed'))
	{
		return res.status(404).send();		
	}
	else
	{
		//Never Provided Attribute - No Problem here
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0)
	{
		validAttributes.description = body.description;
	}
	else if (body.hasOwnProperty('description'))
	{
		return res.status(400).send();		
	}
	else
	{
		//Never Provided Attribute - No Problem here
	}
	
	//HERE - We are good to Update  _.extend
	_.extend(match, validAttributes);
	console.log(match);
	res.json(match);
	
	
});



//********************************
//DELETE  (A TODO)
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
//POST (CREATE A TODO)
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
//GETS  (RETRIEVE A TODO)
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
