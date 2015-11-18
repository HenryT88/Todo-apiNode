var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.json());


var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

//POST
app.post('/todos', function(req,res)
{
	var body = req.body;
	console.log('description: ' + body.description);
	body.id = todoNextId;
	
	res.json(body);
	todos.push(body);
	todoNextId +=1;
});



//GETS
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
	console.log(todoId);
	var match;
	todos.forEach(function(tos){
		//console.log(tos);
		if(todoId === tos.id)
		{
			match = tos;
		}		
	});
	
	//console.log(match);
	if(match)
	{
		console.log(match);
		res.json(match);
	}
	else
	{
		res.status(404).send();
	}
	
	//res.send('Asking for Todo With ID of ' + req.params.id);
});


//LISTEN
app.listen(port, function()
{
	console.log('express listening on PORT ' + port);
});
