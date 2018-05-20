
/*
 * 문항등록 page.
 */

var lib = require('./lib/user');
var util = require('util');
var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);
conn.on('error', error =>  console.log(error));

var mainCategories;
var query = 
	"SELECT 	dc_id, dc_category_name	"+
	"FROM		T_BOOK_CATEGORIES " +
	"WHERE		DC_CATEGORY_TYPE = '1' " + 
	"ORDER BY	DC_MAIN_CATEGORY, DC_SUB_CATEGORY, DC_CATEGORY_TYPE " ;

conn.query(query, function(err, rows) {
	  if (!err)	{
		  if(rows) {
			  mainCategories = rows;
		  }
	  }
	  else		{
		  console.log('Error while performing Query.', err);
	  }
});

var dc_id_1st = 0;
query = 
	"SELECT 	dc_id	"+
	"FROM		T_BOOK_CATEGORIES " +
	"WHERE		DC_CATEGORY_TYPE = '1' " + 
	"ORDER BY	DC_MAIN_CATEGORY, DC_SUB_CATEGORY, DC_CATEGORY_TYPE " +
	"LIMIT 1 "
;

conn.query(query, function(err, rows) {
	  if (!err)	{
		  if(rows) {
			  dc_id_1st = rows[0].dc_id;	
			  console.log('dc_id_1st:', dc_id_1st);
		  }
	  }
	  else		{
		  console.log('Error while performing Query.', err);
	  }
});


/////////////////////////////////////////////////////////////////////////
// 
exports.index = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var qi_id=-1;
	
	if(req.method == "GET"){
		//var dc_id_1st = gen1stMainDcId();
		var vItem = {
				qi_question_type:'MC',
				qi_questionnarie:'질문 내용을 입력하세요..',
				qi_total_choice_count:4, 
				qi_difficulty:'60',
				qi_answer_tip:'',
				qi_answer:'',
				qi_desc:'' ,
				qi_answer_num:0 ,
				max_choice_count:5
		};
		
		var vList = [];
		for(i=0; i<vItem.qi_total_choice_count;i++) {
			vList.push({
				option_contents: '',
				is_answer: '0'
			});
		}
		console.log('dc_id_1st.', dc_id_1st);
		
		res.render('L030D020/index', { 
			user:user,
			message: message,
			dc_id:dc_id_1st,
			qi_id:qi_id,
			vItem:vItem,
			vList:vList,
			mainCategories:mainCategories
		});
	}
	/////////////////////////////////
	// POST
	else if(req.method == "POST") {
		var post  = req.body;
		var dc_id = post.dc_id;
		var qi_id = post.qi_id;
		var lastResult = 0;
		
		//////////////// SWAP ////////////////
			
		var selected = post.is_answer, is_answer;
		var vItem = {
				qi_id:post.qi_id,
				qi_question_type:post.qType,
				qi_questionnarie:post.qi_questionnarie,
				qi_total_choice_count:post.qi_total_choice_count, 
				qi_difficulty:post.qi_difficulty, 
				qi_answer_tip:post.qi_answer_tip,
				qi_answer:post.qi_answer,
				qi_desc:post.qi_desc ,
				qi_answer_num:0 ,
				max_choice_count:5
		};
		
		var vList = [];
		for(i=0; i<vItem.qi_total_choice_count;i++) {
			option_contents = req.body['option_contents' + i];
			is_answer =(i==selected)?'1':'0';
			vList.push({
				option_contents:option_contents ,
				is_answer: is_answer
			});
		}
		
		
		res.render('L030D020/index', { 
			user:user,
			message: message,
			dc_id:dc_id,
			qi_id:qi_id,
			vItem:vItem,
			vList:vList,
			mainCategories:mainCategories
		});
	}//POST-END
		
	
	
};

/////////////////////////////////////////////////////////////////////////
//
exports.Item = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var qi_id = (req.params.id==undefined)?0:req.params.id;
	var dc_id;
	var vItem;
	var vList = [];
	var post = req.body;
	
	console.log("/L030D020/Item");
	console.log("qi_id",qi_id);
	query = 
		"SELECT 	B.DC_ID AS DC_ID, QI_QUESTION_TYPE, QI_DIFFICULTY, QI_QUESTIONNARIE, QI_ANSWER_TIP, QI_ANSWER, QI_desc, QI_TOTAL_CHOICE_COUNT " + 
		"FROM		T_QUESTION_ITEM A LEFT JOIN T_QUESTION_RANGE B ON A.QI_ID = B.QI_ID " +
		"WHERE		A.qi_id = " + qi_id + ";";
	console.log("query:",query);
	conn.query(query, function(err,  rows, fields) 
	{
		if (!err)	
		{
			console.log('rows[0]',rows[0]);
			vItem = {
					qi_question_type:rows[0].QI_QUESTION_TYPE,
					qi_questionnarie:rows[0].QI_QUESTIONNARIE,
					qi_total_choice_count:rows[0].QI_TOTAL_CHOICE_COUNT, 
					qi_difficulty:rows[0].QI_DIFFICULTY, 
					qi_answer_tip:rows[0].QI_ANSWER_TIP,
					qi_answer:rows[0].QI_ANSWER,
					qi_desc:rows[0].QI_desc ,
					qi_answer_num:0 ,
					max_choice_count:5
			};
			dc_id = rows[0].DC_ID;
			
			console.log("vItem.qi_question_type:",vItem.qi_question_type);
			if(vItem.qi_question_type == 'MC')
			{
				var query2 = 
					"SELECT 	CS_ID, QI_ID, CS_OPTION_ORDER, CS_OPTION_CONTENTS, CS_IS_ANSWER " +
					"FROM		T_CHOICE_SET " +
					"WHERE		qi_id = " + qi_id + " " +
					"ORDER BY	CS_OPTION_ORDER;"
					;
				
				conn.query(query2, function(err2, rows2, fields2) {
					message = (!err2)?'':'데이터 쿼리 중 에러 발생.';
					console.log("message:",message)
					console.log("rows2:",rows2)
					if(!err2 && rows2) {
						for(i=0; i<vItem.qi_total_choice_count;i++) {
							vList.push({
								option_contents: rows2[i].CS_OPTION_CONTENTS,
								is_answer: rows2[i].CS_IS_ANSWER
							});
						}
					}
					else {
						for(i=0; i<4;i++) {
							vList.push({
								option_contents: '',
								is_answer: '0'
							});
						}
					}
					//console.log('qi_id:',qi_id);
					res.render('L030D020/index', { 
						user:user,
						message: message,
						dc_id:dc_id,
						qi_id:qi_id,
						vItem:vItem,
						vList:vList,
						mainCategories:mainCategories
					});
				});
			}
			else {
				console.log('에러 발생');
				for(i=0; i<4;i++) {
					vList.push({
						option_contents: '',
						is_answer: '0'
					});
				}
				//console.log('qi_id:',qi_id);
				res.render('L030D020/index', { 
					user:user,
					message: message,
					dc_id:dc_id,
					qi_id:qi_id,
					vItem:vItem,
					vList:vList,
					mainCategories:mainCategories
				});
			}
		}
		else {
			message = ' 에러 발생.';
			
			var vItem = {
					qi_id:qi_id,
					qi_question_type:'MC',
					qi_questionnarie:'',
					qi_total_choice_count:4, 
					qi_difficulty:60, 
					qi_answer_tip:'',
					qi_answer:'',
					qi_desc:'' ,
					qi_answer_num:0 ,
					max_choice_count:5
			};
			for(i=0; i<4;i++) {
				vList.push({
					option_contents: '',
					is_answer: '0'
				});
			}
			res.render('L030D020/index', { 
				user:user,
				message: message,
				dc_id:dc_id,
				qi_id:qi_id,
				vItem:vItem,
				vList:vList,
				mainCategories:mainCategories
			});
		}
	});//query-end
};


/////////////////////////////////////////////////////////////////////////
//
exports.Update = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var lastResult = 0;
	
	var post  = req.body;	
	var dc_id = post.dc_id;
	var qi_id = post.qi_id;
	
	/////////////////////////////////
	// From L030D020

	var vItem = {		
		qi_question_type:post.qType,
		qi_difficulty:post.qi_difficulty, 
		qi_questionnarie:post.qi_questionnarie,
		qi_answer_tip:post.qi_answer_tip,
		qi_answer:post.qi_answer,
		qi_desc:post.qi_desc,
		qi_total_choice_count:post.qi_total_choice_count,
		qi_answer_num:0 ,
		max_choice_count:5
	};
	var selected = post.is_answer, is_answer;
	var vList = [];
	for(i=0; i<vItem.qi_total_choice_count;i++) {
		option_contents = req.body['option_contents' + i];
		is_answer =(i==selected)?'1':'0';
		vList.push({
			option_contents:option_contents ,
			is_answer: is_answer
		});
	};
	/////////////////////////////////////////////////
	// item insert 
	if(post.qi_id == -1) {
		console.log("/L030D020/Update/insert");
		var query1 = 
		"INSERT INTO T_QUESTION_ITEM " + 
		"(  QI_QUESTION_TYPE, QI_DIFFICULTY, QI_QUESTIONNARIE, QI_ANSWER_TIP, QI_ANSWER, QI_DESC, QI_TOTAL_CHOICE_COUNT ) " +
		"VALUES ( " + 
		"'"+ post.qType + "', " + 
		"" + post.qi_difficulty + ", " + 
		"'"+ post.qi_questionnarie.replace(/'/g,"''") + "', " + 
		"'"+ post.qi_answer_tip.replace(/'/g,"''") + "', " + 
		"'"+ post.qi_answer.replace(/'/g,"''") + "', " + 
		"'"+ post.qi_desc.replace(/'/g,"''") + "', " + 
		"" + post.qi_total_choice_count + "); " 
		;
		
		query = query1 ;
		
		conn.query(query, function(err, result, fields) 
		{
			if (!err)	
			{
				qi_id = result.insertId;
				
				var query1 = 
					"INSERT INTO T_QUESTION_RANGE " +
					"(QI_ID, DC_ID) " +
					"VALUES (" + qi_id + ", " + dc_id + "); " 
					;
				var query2 = "";
				if(vItem.qi_question_type == 'MC') {
					for(n=1; n<=vList.length;n++) {
						query2 = query2 +	
								"INSERT INTO T_CHOICE_SET  ( QI_ID, CS_OPTION_ORDER, CS_OPTION_CONTENTS, CS_IS_ANSWER) "+
								util.format("VALUES ( %s,%d,'%s','%s');", 
										qi_id, n, 
										vList[n-1].option_contents.replace(/'/g,"''"), 
										vList[n-1].is_answer).replace(/'/g,"''");
					}			
				}
				query = query1 + query2;
				conn.query(query, function(err1, result1, fields1) {
					if(err1)	console.log(err1);
					message = (!err1)?'입력이 완료되었습니다..':'입력 중 에러 발생.';
				});
				
				//console.log('qi_id:',qi_id);
				res.render('L030D020/index', { 
					user:user,
					message: message,
					dc_id:dc_id,
					qi_id:qi_id,
					vItem:vItem,
					vList:vList,
					mainCategories:mainCategories
				});
			}
			else {
				if(err)	console.log(err);
				message = '입력 중 에러 발생.';
				res.render('L030D020/index', { 
					user:user,
					message: message,
					dc_id:dc_id,
					qi_id:qi_id,
					vItem:vItem,
					vList:vList,
					mainCategories:mainCategories
				});
			}
			
		});//query-end
	}
	/////////////////////////////////////////////////
	// item update 
	else{
		console.log("/L030D020/Update/update");
		var query1 = 
			"UPDATE T_QUESTION_ITEM SET	" +
			util.format("QI_QUESTION_TYPE = '%s', "	,	vItem.qi_question_type.replace(/'/g,"''")) +
			util.format("QI_DIFFICULTY = %s, "		,	vItem.qi_difficulty) +
			util.format("QI_QUESTIONNARIE = '%s', "	,	vItem.qi_questionnarie.replace(/'/g,"''")) +
			util.format("QI_ANSWER_TIP = '%s',  "	,	vItem.qi_answer_tip.replace(/'/g,"''")) + 
			util.format("QI_ANSWER = '%s',  "		,	vItem.qi_answer.replace(/'/g,"''")) + 
			util.format("QI_DESC = '%s', "	,			vItem.qi_desc.replace(/'/g,"''")) + 
			util.format("QI_TOTAL_CHOICE_COUNT = %s,",	vItem.qi_total_choice_count ) + 
			"QI_UPDATE = CURRENT_TIMESTAMP " + 
			"WHERE       QI_ID     = " + qi_id + ";" +
			"UPDATE T_QUESTION_RANGE  SET " +
			"DC_ID = " + dc_id + " "+
			"WHERE QI_ID = " + qi_id + "; " 
			;
		var query2 = "";
		var query3 = "";
		if(vItem.qi_question_type == 'MC') {
			query2 = util.format("DELETE  FROM  T_CHOICE_SET  WHERE  QI_ID = %s;",	qi_id);
			for(n=1; n<=vList.length;n++) {
				query3 = query3 +	
						"INSERT INTO T_CHOICE_SET  ( QI_ID, CS_OPTION_ORDER, CS_OPTION_CONTENTS, CS_IS_ANSWER) "+
						util.format("VALUES ( %s,%d,'%s','%s');", 
								qi_id, n, 
								vList[n-1].option_contents.replace(/'/g,"''"), 
								vList[n-1].is_answer.replace(/'/g,"''"));
			}
		}
		query = query1 + query2 + query3;
		console.log("query:",query);
		conn.query(query, function(err2, result2, fields2) 
		{
			if (!err2)	{	message = '수정 되었습니다..';	}
			else		{	message = '입력 중 에러 발생.'; console.log(err2);	}
			res.render('L030D020/index', { 
				user:user,
				message: message,
				dc_id:dc_id,
				qi_id:qi_id,
				vItem:vItem,
				vList:vList,
				mainCategories:mainCategories
			});
		});//query-end
	}

};




