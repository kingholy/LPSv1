
/*
 * 카테고리별 문항 풀기 
 */

var lib = require('./lib/user');
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
//
exports.list = function(req, res){
	var user = lib.getUserData(req);
	
	res.render('L040D020/list', 
	{ 
		user:user,
  		vList: mainCategories  		
  	});
};


/////////////////////////////////////////////////////////////////////////
//
exports.exam = function(req, res){
	var user = lib.getUserData(req);
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
				  	"	WHERE B.dc_id = " +dc_id+ " "+ 
				  	"	order by rand() limit 3 " + 
				  	")A;"
					;
					
				var query2 = 
					"SELECT 	" + 
					"	qs_id, " + 
					"	A.qi_id AS qi_id, " + 
					"	qi_question_type,  " + 
					"	qi_difficulty,  " + 
					"	qi_questionnarie,  " + 
					"	qi_answer_tip,  " + 
					"	qi_total_choice_count " + 
					"FROM	T_QUESTION_ITEM A  LEFT JOIN  T_QUESTION_SET B ON A.qi_id = B.qi_id  " + 
					"WHERE	ts_id = "+ ts_id + " " + 
					"ORDER BY	qi_question_type desc, qi_difficulty, A.qi_id; "
				;
				
				query = query1 + query2;
				console.log("query:",query);
				conn.query(query, function(err1, rows1, fields1) 
				{
					if (err)	{	
						message = '입력 중 에러 발생.';	
						console.log("err1:",err1);
						res.render('L040D020/exam', 
						{ 
							user:user,
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
						console.log("rows1:",rows1[0]);
						vItem = rows1[1];
						////////////////////////// vList만들고, vItem 인덱스 만들기
						var qiIndex = {};
						//var tempQiId;
						for(k in vItem) {
							//tempQiId = vItem[k].qi_id.toString();
							qiIndex["id".concat(vItem[k].qi_id)] = k;
							vItem[k]['vList'] = new Array();
							vItem[k]['my_answer'] = '';
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
	var tt_id=0;
	var ts_id=0;
	var dc_id = req.body.dc_id;
	var qi_list="";
	var vOption="answer";
	var vItem = new Array();
	
	res.render('L040D020/exam', 
	{ 
		user:user,
		tt_id:tt_id,
		ts_id:ts_id,
		dc_id:dc_id,
		qi_list:qi_list,
		mainCategories:mainCategories  ,
		vItem:vItem,
		vOption:vOption
  	});
};
















