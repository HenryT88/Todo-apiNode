var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage':'basic-sqlite-database.sqlite'
});

//CREATES A TABLE CALLED todos
var Todo = sequelize.define('todo',{
	description:{
		type:Sequelize.STRING,
		allowNull : false,
		validate: {
			len: [1,250]
			
		}
	},
	completed:{
		type:Sequelize.BOOLEAN,
		allowNull : false,
		defaultValue: false
		
	}
});

var User = sequelize.define('user',{
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	//force:true 
}).then(function(){
	console.log('Everything is Synced');
	
	User.findById(1).then(function(user){
		user.getTodos({
			where : {completed: false}
		}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		});
	});

/*	User.create({
		email: 'henry@henry.com'
	}).then(function(){
		return Todo.create({
			description:"Clean Yard"
		});
	}).then(function(todo){
		User.findById(1).then(function(user){
			user.addTodo(todo);
		})
	});
	*/
});	
	
