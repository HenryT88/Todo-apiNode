var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet Jitka for Lunch',
	completed: false
},{
	id:2,
	description:'Go to Computer Shop',
	completed: false
},{
	id:3,
	description:'Open the Bar',
	completed: false
}];

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
