
/*
 * 카테고리별 문항 풀기 
 */

var lib = require('./lib/user');
var libAns = require('./lib/answerCheck');
///////// database /////////// 
var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);

///////////////////////////////
//get main categiry-list
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

///////////////////////////////
//get 1st main categiry 
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
// 단원별 리스트 
exports.list = function(req, res){
	var user = lib.getUserData(req);
	
	res.render('L040D020/list', 
	{ 
		user:user,
  		vList: mainCategories  		
  	});
};


/////////////////////////////////////////////////////////////////////////
// 단원별 임의 시험 
exports.exam = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var tt_id=0;
	var ts_id=0;
	var dc_id = (req.params.dc_id==undefined)?dc_id_1st:req.params.dc_id;
	var qi_list="";
	var vOption="exam";
	var vItem = new Array();
	var testType='I'; //임의시험
	
	if(req.method == "GET")
	{
		////////// test-set 만들기 ///////////
		var query =
			"INSERT INTO T_TEST_SET(TS_TEST_TYPE, TS_MADEBY_WHO, ts_title) " +
			"VALUES ("+ 
			"'"  + testType + "'," +
			"'" + user.userId + "'," +
			"'임의 시험');"
			;
		conn.query(query, function(err, result, fields) 
		{
			if (err){	
				message = '입력 중 에러 발생.';
				console.log("err:",err);
				res.render('L040D020/exam', 
						{ 
							user:user,
							message:message,
							tt_id:tt_id,
							ts_id:ts_id,
							dc_id:dc_id,
							qi_list:qi_list,
							mainCategories:mainCategories  ,
							vItem:vItem,
							vOption:vOption
					  	});
			}
			else{
				ts_id = result.insertId;
				/////// 랜덤으로 문항 추출 ////////
				var query1 = 
					
					"INSERT INTO T_QUESTION_SET (ts_id, qi_id) " +
					"SELECT "+ts_id+", A.qi_id AS qi_id FROM ( " +
				  	"	SELECT A.QI_ID AS qi_id " +
				  	"	FROM T_QUESTION_ITEM A LEFT JOIN T_QUESTION_RANGE  B " +
				  	"	ON A.qi_id=B.qi_id " +
				  	"	WHERE B.dc_id = " +dc_id+ " AND A.qi_question_type <> 'VL' "+ 
				  	"	order by rand() limit 3 " + 
				  	")A;"	+
				  	"INSERT INTO T_TEST_SET_RANGE (ts_id, dc_id) " +
				  	"VALUES ( "+ ts_id +"," + dc_id +" ); "
					;
					
				var query2 = 
					"SELECT 	" + 
					//"	qs_id, " + 
					"	A.qi_id AS qi_id, " + 
					"	qi_question_type,  " + 
					"	qi_difficulty,  " + 
					"	qi_questionnarie,  " + 
					"	qi_answer_tip,  " + 
					"	getRowCount(qi_answer) AS qi_answer_length,  " + 
					"	qi_total_choice_count " + 
					"FROM	T_QUESTION_ITEM A  LEFT JOIN  T_QUESTION_SET B ON A.qi_id = B.qi_id  " + 
					"WHERE	ts_id = "+ ts_id + " " + 
					"ORDER BY	qi_question_type, qi_difficulty, A.qi_id; "
				;
				
				query = query1 + query2;
				console.log("query:",query);
				conn.query(query, function(err1, rows1, fields1) 
				{
					if (err1)	{	
						message = '입력 중 에러 발생.';	
						console.log("err1:",err1);
						res.render('L040D020/exam', 
						{ 
							user:user,
							message:message,
							tt_id:tt_id,
							ts_id:ts_id,
							dc_id:dc_id,
							qi_list:qi_list,
							mainCategories:mainCategories  ,
							vItem:vItem,
							vOption:vOption
					  	});
					}
					else {		
						console.log("<<<<rows1:",rows1);
						vItem = rows1[2];
						////////////////////////// vList만들고, vItem 인덱스 만들기
						var qiIndex = {};
						//var tempQiId;
						for(k in vItem) {
							//tempQiId = vItem[k].qi_id.toString();
							qiIndex["id".concat(vItem[k].qi_id)] = k;
							vItem[k]['vList'] = new Array();
							vItem[k]['my_answer'] = '';
							if(k!=0) qi_list = qi_list.concat(',');
							qi_list = qi_list.concat(vItem[k].qi_id);
						}/////////////////////////
						console.log("vItem:",vItem);
						query = 
							"SELECT 	" + 
							"	qi_id, " + 
							"	cs_option_order,  " + 
							"	cs_option_contents  " + 
							"FROM		T_CHOICE_SET " + 
							"WHERE		QI_ID IN (SELECT qi_id FROM T_QUESTION_SET WHERE ts_id = '"+ts_id+"') " + 
				            "ORDER BY	QI_ID, CS_OPTION_ORDER;"
						;
						console.log("query:",query);
						conn.query(query, function(err2, rows2, fields2) 
						{
							if (err)	{	
								message = '입력 중 에러 발생.';	
								console.log("err:",err);
							}
							else {
								console.log('rows2:',rows2);
								//////////////////////////////// 인덱스 이용 vItem의 qi_id위치 찾아서, vList 삽입
								for(m in rows2) {
									tempQiId = qiIndex["id".concat(rows2[m].qi_id)];
									vItem[tempQiId].vList.push(rows2[m]);
									console.log('vItem',vItem);
								}
								/////////////////////////////////
							}
							res.render('L040D020/exam', 
							{ 
								user:user,
								message:message,
								tt_id:tt_id,
								ts_id:ts_id,
								dc_id:dc_id,
								qi_list:qi_list,
								mainCategories:mainCategories  ,
								vItem:vItem,
								vOption:vOption
						  	});
						});//query-end
						
					}
					
				});//query-end
				
				
			
			}
			
			
			
			
			
			
			
			
			
			
		});//query-end
		
		
	}
};

/////////////////////////////////////////////////////////////////////////
//
exports.answer = function(req, res){
	var user = lib.getUserData(req);
	var message='';
	var post = req.body;
	var vOption="answer";
	var vItem = new Array();
	
	var qi_list= post.qi_list;	
	var vQList = qi_list.split(',');
	var tt_id = post.tt_id;
	var ts_id = post.ts_id;
	var dc_id = post.dc_id;
	var qi_id;
	var my_answer_text;
	var my_answer_choice;
	var vAns = new Array();
	
	// select answer 
	var query =
		"SELECT 	" + 
		"	qi_id, " + 
		"	qi_question_type,  " + 
		"	qi_difficulty,  " + 
		"	qi_questionnarie,  " + 
		"	qi_answer_tip,  " + 
		"	qi_answer,  " + 
		"	getRowCount(qi_answer) AS qi_answer_length,  " + 
		"	qi_total_choice_count " + 
		"FROM	( " +
		"	SELECT	A.qi_id AS qi_id , qi_question_type, qi_difficulty, qi_questionnarie, qi_answer_tip, qi_answer, qi_total_choice_count, " +
		"			ifnull(cs_is_answer, 1) as cs_is_answer, " +
		"			ifnull(cs_option_order, 0) as cs_option_order "+
		"	FROM	T_QUESTION_ITEM A  LEFT JOIN  T_CHOICE_SET B ON A.qi_id = B.qi_id " +
		") A " +
		"WHERE	cs_is_answer = 1 AND qi_id in (" + qi_list + ")";
		"ORDER BY	qi_question_type desc, qi_difficulty, qi_id; "
	
	conn.query(query, function(err, rows, fields) 
	{
		if(err) {
			console.log(err);
			message = '';
			res.render('L040D020/exam', 
			{ 
				user:user,
				message:message,
				tt_id:tt_id,
				ts_id:ts_id,
				dc_id:dc_id,
				qi_list:qi_list,
				mainCategories:mainCategories  ,
				vItem:vItem,
				vAns:vAns,
				vOption:vOption
		  	});
		}
		else {
			/////////////
			vItem = rows;
			var qiIndex = {};
			for(k in vItem) {
				//tempQiId = vItem[k].qi_id.toString();
				qiIndex["id".concat(vItem[k].qi_id)] = k;
				vItem[k]['vList'] = new Array();
				vItem[k]['my_answer'] = post['my_answer'.concat(vItem[k].qi_id)];  //<= my answer setting
				if(k!=0) qi_list = qi_list.concat(',');
				qi_list = qi_list.concat(vItem[k].qi_id);
			}
			console.log("vItem:",vItem);
			query = 
				"SELECT 	" + 
				"	qi_id, " + 
				"	cs_option_order,  " + 				
				"	cs_option_contents,  " + 
				"	cs_is_answer  " + 
				"FROM		T_CHOICE_SET " + 
				"WHERE		QI_ID IN (SELECT qi_id FROM T_QUESTION_SET WHERE ts_id = '"+ts_id+"') " + 
	            "ORDER BY	QI_ID, CS_OPTION_ORDER;"
			;
			console.log("query:",query);
			conn.query(query, function(err1, rows1, fields1) 
			{
				if(err1) {
					console.log(err1);
					message = '';
					res.render('L040D020/exam', 
					{ 
						user:user,
						message:message,
						tt_id:tt_id,
						ts_id:ts_id,
						dc_id:dc_id,
						qi_list:qi_list,
						mainCategories:mainCategories  ,
						vItem:vItem,
						vAns:vAns,
						vOption:vOption
				  	});
				}
				else {

					////////////////////////////////
					//인덱스 이용 vItem의 qi_id위치 찾아서, vList 삽입
					for(m in rows1) {
						tempQiId = qiIndex["id".concat(rows1[m].qi_id)];
						vItem[tempQiId].vList.push(rows1[m]);		
						if(rows1[m].cs_is_answer == '1') {
							vItem[tempQiId].qi_answer = rows1[m].cs_option_order;
						}
					}
					/////////////////////////////////
					// update test taker 
					query = 
						"INSERT	INTO T_TEST_TAKER (TS_ID, US_USERNAME, TT_IS_SOLVED, TT_SOLVED_AT, TAKE_AT)"+
						"VALUES	("+ts_id+", '"+user.userId+"', 1, CURRENT_TIMESTAMP, getTakeAt("+ts_id+") );"
						;
					conn.query(query, function(err1, result1, fields1) 
					{
						if(err1) {
							console.log(err1);
							message = '';
							res.render('L040D020/exam', 
							{ 
								user:user,
								message:message,
								tt_id:tt_id,
								ts_id:ts_id,
								dc_id:dc_id,
								qi_list:qi_list,
								mainCategories:mainCategories  ,
								vItem:vItem,
								vAns:vAns,
								vOption:vOption
						  	});
						}
						else {
							tt_id = result1.insertId;
							// insert answerSheets
							query = "";
							var query1, query2;
							var my_answer_text = "", my_answer_choice = 0;
							var score=0,partial=0, isCorrect=false;
							var myans_key;
							for(i in vItem) 
							{
								qi_id = vItem[i].qi_id;
								qType = post['question_type'+qi_id.toString()];
								myans_key = 'my_answer'+qi_id.toString();
								if(qType == 'MC')	my_answer_choice = parseInt(post[myans_key]);
								else				my_answer_text   = post[myans_key].toString();
								
								////////////// 답을 맞췄는지 체크 ////////
								console.log('vItem[i]',vItem[i]);
								isCorrect = libAns.IsCorrectAnswer(post, qi_id, vItem[i]);
								console.log('isCorrect',isCorrect);
								vAns.push(isCorrect);
								score = (isCorrect==true)?100:0;
								partial = 0;
								//////////////////////
								query1 = 
								"INSERT INTO T_ANSWER_SHEET(TT_ID, QI_ID, AS_ANSWER_TEXT, AS_ANSWER_CHOICE,  AS_HIT_SCORE, AS_PARTIAL_SCORE )" + 
								"VALUES		( " +
								"" + tt_id + "," +
								"" + qi_id + "," +
								"'"+ my_answer_text.replace(/'/g,"''") + "'," +
								"" + my_answer_choice + "," +
								"" + score + "," +
								"" + partial + ");"
								;
								query = query+query1;
							}
							console.log('vItem',vItem);
							console.log('vAns',vAns);
							conn.query(query, function(err2, result2, fields2) 
							{
								if(err2) {
									console.log(err2);
									message = '';
								}
								res.render('L040D020/exam', 
								{ 
									user:user,
									message:message,
									tt_id:tt_id,
									ts_id:ts_id,
									dc_id:dc_id,
									qi_list:qi_list,
									mainCategories:mainCategories  ,
									vItem:vItem,
									vAns:vAns,
									vOption:vOption
							  	});
								
							});
						}
						
						
					});
					
					
					
					
				}//end-else err2
			});
		}//end-else
	});
	
	// check correct answer
	
	
	
	
	
};
















