
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var middleware = require ('./middleware.js')(db);
var bcrypt = require('bcrypt');


var app = express();
app.use(bodyParser.json());


var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;


//********************************
//PUT   (UPDATE A TODO)
//********************************
app.put('/todos/:id', middleware.requireAuthentication,  function(req,res)
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
	
	db.todo.findOne({
		where:{
			id:todoId,
			userId : req.user.get('id') 
		}
	}).then(function(todo){
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
app.get('/', middleware.requireAuthentication,function(req,res)
{	
	res.send('Todo API Root');
});

app.get('/todos', middleware.requireAuthentication, function(req, res)
{
	var query = req.query;
	
	var where = {
		userId : req.user.get('id')
		}
	
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

app.get('/todos/:id',middleware.requireAuthentication, function(req,res)
{
	
	var todoId = parseInt(req.params.id);
	
	
	//Switch to findOne with Where Object and 
	db.todo.findOne({
		where:{
			id : todoId,
			userId : req.user.get('id')
		}
	}).then(function(todo){
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

app.delete('/todos/:id',middleware.requireAuthentication, function(req, res)
{
	var todoId = parseInt(req.params.id);
	console.log(todoId);
	console.log(db.todo);
	
	/*
	var match = _.findWhere(db.todo, {id:todoId});
	
	*/
	db.todo.destroy({
		where: {
			id:todoId,
			userId : req.user.get('id')
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
	
});


//********************************
//POST (CREATE A TODO)
//********************************
app.post('/todos', middleware.requireAuthentication, function(req,res)
{
	var body = _.pick(req.body,'description', 'completed');
	
	db.todo.create(body).then(function(todo){
		//res.json(todo.toJSON())
		req.user.addTodo(todo).then(function(){
			return todo.reload() //Reference is Different 
		}).then(function(todo){
			res.json(todo.toJSON())
		});
		
	},function(e){
		res.status(400).json(e);
	});
	
	///call db.todo.create() and if good - respond 200 and todo, else respond 400 (respond res.status(400).json(e)
	
});

//********************************
//POST USER REQUEST
//********************************
app.post('/users', function(req,res)
{
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON())
	}, function(e){
			res.status(400).json(e);
	});
});

//********************************
// POST METHOD /users/login
//********************************
app.post('/users/login', function(req,res){
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;
	var str = [];
	str.push(req.body);
	db.user.authenticate(body).then(function(user){		
		var token = user.generateToken('authentication');
		str.push("Token: " + token);
		userInstance = user;
		str.push("User: " + user);
		return db.token.create({
			token:token
		});
		
	}).then(function(tokenInstance){
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
		
	}).catch(function(e){
		//res.status(401).json(e);
		res.send(str);
		
	});
});

//********************************
// DELETE METHOD /users/login
//********************************
app.delete('/users/login', middleware.requireAuthentication, function(req, res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function(){
		res.status(500).send();
	});
});

//********************************
//LISTEN
//********************************

db.sequelize.sync({force:true}).then(function(){
	app.listen(port, function()
	{
		console.log('express listening on PORT ' + port);
	});
})





