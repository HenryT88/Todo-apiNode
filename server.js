
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


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
//GETS  (RETRIEVE A TODO)
//********************************
app.get('/', function(req,res)
{	
	res.send('Todo API Root');
});

app.get('/todos', function(req, res)
{
	var queryParams = req.query;
	console.log(queryParams);
	var filteredTodos = todos;
	
	if (queryParams.completed && queryParams.completed === 'true')
	{
		filteredTodos = _.where(todos,{"completed":true} );
	}
	else if (queryParams.completed && queryParams.completed === 'false')
	{
		filteredTodos = _.where(todos,{"completed":false} );
	}
	
	//"Go To Work On Saturuday".indexOf('Work')
	
	
	if(queryParams.q && queryParams.q.length > 0)
	{
		filteredTodos = _.filter(filteredTodos,function(item)
		{
			return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >= 0;
		});
		
	}
	
		res.json(filteredTodos);
	
});

app.get('/todos/:id', function(req,res)
{
	
	var todoId = parseInt(req.params.id);
	
	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON())
		}else
		{
			res.status(404).send();
		}		
		
	},function(e){
		res.status(500).send();
	});
	
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
	
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON())
		
	},function(e){
		res.status(400).json(e);
	});
	
	///call db.todo.create() and if good - respond 200 and todo, else respond 400 (respond res.status(400).json(e)
	
});



//********************************
//LISTEN
//********************************

db.sequelize.sync().then(function(){
	app.listen(port, function()
	{
		console.log('express listening on PORT ' + port);
	});
})


