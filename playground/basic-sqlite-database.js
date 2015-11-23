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
})


sequelize.sync({
	//force:true
}).then(function(){
	console.log('Everything is Synced');
	// Fetch a Todo Item by ID and print to screen - otherwise not Found.
	Todo.findOne({
			where: {description: {$like : '%Dog%'}}
		
	}).then(function(todoer){
		
		if(todoer)
		{
			console.log(todoer.toJSON());
		}
		else
		{
			console.log('Not Found Buddy!!');
		}
	});
});	
	/*Todo.create({
		description: 'Take out Trash'
		
	}).then(function(todo){
			return Todo.create({
				description: 'Walk the Dog'
		});
	}).then(function(){
			//return Todo.findById(1)
			return Todo.findAll({
				where:{
					description: {
						$like: '%trash%'
					}
				}
				
			});
		}).then(function(todos){			
			if(todos){
				todos.forEach(function(todo){
					console.log(todo.toJSON());
				});
				
			}else{
				console.log('no todo found!!');
			}

	}).catch(function(e){
		console.log(e);
	});

	*/

