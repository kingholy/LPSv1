

module.exports = 
{
	IsCorrectAnswer:function(post, qi_id, item)
	{
		var isCorrect=false;
		var qi_id = item.qi_id;
		var myans_key = 'my_answer'+qi_id.toString();
		var my_answer_choice = parseInt(post[myans_key]);
		var my_answer_text   = post[myans_key];
		console.log('my_answer_choice',my_answer_choice);
		console.log('my_answer_text',my_answer_text);
		console.log('item.qi_answer',item.qi_answer);
		if(item.qi_question_type == 'MC') {
			console.log('item.vList',item.vList);
			for( i in item.vList) {
				if(parseInt(item.vList[i].cs_is_answer) ==1 &&
				   my_answer_choice == item.vList[i].cs_option_order) 
				{
						isCorrect=true; break;
				}
			}
		}
		else {
			if(my_answer_text.trim() == item.qi_answer.trim()){
				isCorrect=true;
			}
		}

		console.log("qi_id=",qi_id,":isCorrect=",isCorrect)
		return isCorrect;
	},
	
	
	getParseResult:function(post, qi_id, item)
	{
		var results="";
		var resultDone="";
		var fname = "script.py";
		var qi_id = item.qi_id;
		var myans_key = 'my_answer'+qi_id.toString();
		var my_answer_text   = post[myans_key];
		console.log('my_answer_text',my_answer_text);
		console.log('item.qi_answer',item.qi_answer);
		var isDone= false;
		
		const fs = require('fs'); 
		fs.writeFileSync(fname, my_answer_text.trim(), {encoding: 'utf8'});
		var PythonShell = require('python-shell');
		var options = {
		  mode: 'text',
		  pythonPath: '',
		  pythonOptions: ['-u'],
		  scriptPath: '',
		  args: ['value1', 'value2', 'value3']
		};
		PythonShell.run(fname, options, function (err, results) {
			if (err) {
				console.log('err:', err);
			}
			resultDone = results;
			isDone = true;
		});
		
		var sleep = require('system-sleep');
		while(!isDone) { 
			sleep(100);
		}
		
		console.log("END#qi_id=",qi_id,":results=",resultDone)
		return resultDone;
	},
	
	test:function()
	{
		var results;
		var src = "length = 5 \n"+
				"breadth = 2 \n"+
				"area = length x breadth \n"+
				"print( 'Area is', area )"
				;
		const fs = require('fs'); 
		fs.writeFileSync("script.py", src, {encoding: 'utf8'});

		var PythonShell = require('python-shell');


		var options = {
		  mode: 'text',
		  pythonPath: '',
		  pythonOptions: ['-u'],
		  scriptPath: '',
		  args: ['value1', 'value2', 'value3']
		};


		PythonShell.run('script.py', options, function (err, results) {
			if (err) {
				console.log('err: %j', err);
			}
			console.log('results: %j', results);
		
		});
		return results;
	}
	

};

