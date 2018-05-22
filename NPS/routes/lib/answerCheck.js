
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
	}
};

