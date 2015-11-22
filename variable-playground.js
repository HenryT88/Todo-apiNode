//ARRAY EXAMPLE

/* Make new array of Grades
 *  Make a Function - addGrade - push on new value.
 * New array gets updated - 
 * Doesnt get updated
 * Call method then console.log.
 * */


var grades = [35, 14];

function addGrade(array, value)
{
	array.push(value);
	console.log(array);
}

function addGrader(array, value)
{
	var array = [];
	array.push(value);
	console.log(array);
}

addGrade(grades, 22);
addGrader(grades, 22);

