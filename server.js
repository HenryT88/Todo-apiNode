
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
	var body = _.pick(req.body,'description', 'completed');
	var attributes = {};
	

	if(body.hasOwnProperty('completed'))
	{
		attributes.completed = body.completed;
	}
	
	if(body.hasOwnProperty('description'))
	{
		attributes.description = body.description;
	}
	
	db.todo.findById(todoId).then(function(todo){
		if(todo)
		{
			todo.update(attributes).then(function(todo){
			res.json(todo.toJSON());
			}, function(e){
				res.status(400).json(e);
			});
		}
		else
		{
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});

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
	var query = req.query;
	
	var where = {}
	
	if(query.hasOwnProperty('completed') && query.completed === 'true')
	{
		where.completed = true;
	}else if(query.hasOwnProperty('completed') && query.completed === 'false')
	{
		where.completed = false;
	}
	
	if(query.hasOwnProperty('q') && query.q.length > 0)
	{
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	
	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
		
	}, function(e){
		res.status(500).send();
	});
	
	
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
	console.log(todoId);
	console.log(db.todo);
	
	/*
	var match = _.findWhere(db.todo, {id:todoId});
	
	*/
	db.todo.destroy({
		where: {
			id:todoId
		}
	}).then(function(rowsDeleted){
		if(rowsDeleted === 0)
		{
			res.status(404).json({
				error:"No Todo with ID"
			});
		}
		else
		{
			res.status(204).send();
		}
		
	}, function(){
		res.status(500).send();
	});
	
	
	/*
	if(match)
	{
		console.log('Deleted:');
		console.log(match);
		//db.todo = _.without(db.todo,match);
		//res.status(200).send(match);
		
	}
	else
	{
		res.status(404).send();
	}*/
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


