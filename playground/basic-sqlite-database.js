var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage':'basic-sqlite-database.sqlite'
});

//CREATES A TABLE CALLED todos
var Todo = sequelize.define('todo',{
	description:{
		type:Sequelize.STRING
	},
	completed:{
		type:Sequelize.BOOLEAN
	}
})


sequelize.sync().then(function(){
	console.log('Everything is Synced');
	
	Todo.create({
		description: 'First Entry',
		completed: false
	}).then(function(todo){
		console.log('Finished');
		console.log(todo);
	});
});
