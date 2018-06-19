
/*
 * 정규시험 만들기 page.
 */
var lib = require('./lib/user');
var util = require('util');
var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);
conn.on('error', error =>  console.log(error));

var mainCategories ;

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
//get 1st dc_id
var dc_id_1st = 0;
var query = 
"SELECT 	dc_id	"+
"FROM		T_BOOK_CATEGORIES " +
"WHERE		DC_CATEGORY_TYPE = '1' " + 
"ORDER BY	DC_MAIN_CATEGORY, DC_SUB_CATEGORY, DC_CATEGORY_TYPE " +
"LIMIT 1; "
;
conn.query(query, function(err, rows, fields) {
	if (!err && rows)	{
		dc_id_1st = rows[0].dc_id;
		console.log("rows[0].dc_id:",rows[0].dc_id);
	}
	else	{
		console.log('Error while performing Query.', err);
	}
});




/////////////////////////////////////////////////////////////////////////
//정규시험 리스트 
exports.list = function(req, res){
	var user = lib.getUserData(req);
	var OTestList = new Array();
	var query = 
		"SELECT 	" +
		"	tt_id, ts_title, ts_test_type, ts_time_limit, us_username,"+
		"	tt_is_solved, "+
		"	getScoreTT(tt_id) as nScore, "+
		"	getRemainTT(tt_id) as nRemain, "+
		"	DATE_FORMAT(take_at,'%Y-%m-%d') AS take_at ,"+
		"	DATE_FORMAT(tt_solved_at,'%Y-%m-%d') AS tt_solved_at "+
		"FROM		t_test_taker A LEFT JOIN t_test_set B ON A.ts_id = B.ts_id " +
		"WHERE		ts_test_type = 'O' AND us_username<>'admin' ORDER BY A.ts_id, tt_id; "
		;
	conn.query(query, function(err, rows) 
	{
		if (err)	{	  
			console.log('Error while performing Query.', err); 		  
		}
		else {
			console.log(rows);
			OTestList = rows;
		}
		res.render('L050D020/list', 
			{ 
			user:user,
			vList: OTestList 		
		});
	});


};


/////////////////////////////////////////////////////////////////////////
//
exports.insert = function(req, res){
	//var user = lib.getUserData(req);
	var message = '';
	var query1 = '';
	var idList = [];
	var post  = req.body;
	var ts_id=(req.body.ts_id==undefined)?0:req.body.ts_id;
	if(typeof(post.qi_id)=='string'){	idList.push(post.qi_id);	}
	else 							{	idList = post.qi_id;		}
	
	var qi_id;
	for(i in idList) {
		qi_id = idList[i];
		query1 = 
			query1+ 
			"INSERT INTO t_question_set (ts_id, qi_id) VALUES ("+ts_id+","+qi_id+");";
		console.log('query:',query);
	}
	console.log('query1:',query1);
	
	conn.query(query1, function(err2, result2, fields2) 
	{
		if (!err2)	
		{	message = 'success';
		}
	});
	
	res.redirect('/L050D020/update/'+ts_id);
			
};

/////////////////////////////////////////////////////////////////////////
//
exports.add = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var ts_id=-1;
	var post  = req.body;
	
	if(req.method == "GET"){
		ts_id = (req.params.ts_id==undefined)?0:req.params.ts_id;
	}
	else{
		ts_id = (req.body.ts_id==undefined)?0:req.body.ts_id;
	}
	
	var req_dc_id = post.dc_id;
	dc_id = (req_dc_id==undefined)?dc_id_1st:req_dc_id;
	console.log("dc_id_1st:",dc_id_1st);
	console.log("req_dc_id:",req_dc_id);
	query = 
		"SELECT 	" + 
		"	A.qi_id AS qi_id, " + 
		"	qi_question_type,  " + 
		"	qi_difficulty,  " + 
		"	qi_questionnarie,  " + 
		"	qi_answer,  " + 
		"	qi_answer_tip,  " + 
		"	qi_total_choice_count, " + 
		"	DATE_FORMAT(qi_update,'%Y-%m-%d') as qi_update " + 
		"FROM		T_QUESTION_ITEM A   LEFT JOIN	T_QUESTION_RANGE  B    ON A.qi_id=B.qi_id  " + 
		"WHERE		B.dc_id = "+ dc_id + " AND "+ 
		"			A.qi_id not in (select qi_id from t_question_set where ts_id =  "+ts_id+") " + 
		"ORDER BY	qi_question_type, qi_difficulty, A.qi_id; "
	;
	
	console.log("query:",query);
	conn.query(query, function(err, rows, fields) {
		if (!err && rows) {	 
			vList = rows;	  
		}
		else {
			console.log('Error while performing Query.', err);  
		}
		res.render('L050D020/add', { 
			user:user,
			message: message,
			ts_id:ts_id,
			dc_id:dc_id,
			vList:vList,
			mainCategories:mainCategories
		});
	});//end_query	
	
};

/////////////////////////////////////////////////////////////////////////
//
exports.delete = function(req, res){
	var message = '';
	var ts_id=req.body.ts_id;
	console.log('delete ts_id:',ts_id);
	var qs_id = (req.params.qs_id==undefined)?0:req.params.qs_id;
	query = 
		"DELETE FROM 	t_question_set "+
		"WHERE		qs_id = " + qs_id + " ;" 
		;
	conn.query(query, function(err, rows) {
		if (!err)	{	console.log('delete success');	  }
		else		{	console.log('Error while performing Query.', err); }
	});
	res.redirect('/L050D020/update/'+ts_id);
};

/////////////////////////////////////////////////////////////////////////
//
exports.update = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var ts_id;
	
	//if(req.method == "GET"){
		console.log("/L050D0020/update/");
		ts_id = (req.params.ts_id==undefined)?0:req.params.ts_id;
	//}
	
	var vTSet = {	};
	var vItem = new Array();
	query = 
		"SELECT 	ts_title, ts_test_type, ts_time_limit "+
		"FROM		t_test_set " +
		"WHERE		ts_id = "+ ts_id + " " + 
		"LIMIT 1 ;" ;
	console.log('query',query);
	conn.query(query, function(err, rows) {
		  if (!err)	{
			  if(rows) {
				  console.log('rows:',rows);
				  vTSet.ts_title  = rows[0].ts_title;
				  vTSet.ts_test_type = rows[0].ts_test_type;
				  vTSet.ts_time_limit = rows[0].ts_time_limit;
				  vTSet.ts_madeby_who = req.session.userId;
				  vTSet.ts_time_limit = rows[0].ts_time_limit;
			  }
		  }
		  else		{
			  console.log('Error while performing Query.', err);
		  }
		  
		  var query1 = 
				"SELECT 	" + 
				"	qs_id, " + 
				"	A.qi_id AS qi_id, " + 
				"	qi_question_type,  " + 
				"	qi_difficulty,  " + 
				"	qi_questionnarie,  " + 
				"	qi_answer_tip,  " + 
				"	qi_total_choice_count, " + 
				"	DATE_FORMAT(qi_update,'%Y-%m-%d') as qi_update " + 
				"FROM		T_QUESTION_ITEM A   LEFT JOIN	t_question_set  B    ON A.qi_id=B.qi_id  " + 
				"WHERE		B.ts_id = "+ ts_id + " " + 
				"ORDER BY	qi_question_type, qi_difficulty, A.qi_id; "
			;
		  //console.log('query1',query1);
		  console.log('global_title',global_title);
		  
		  conn.query(query1, function(err1, rows1, fields1) {
				if (!err && rows1) {	 
					console.log('rows1:',rows1);
					///////////MC-start//////////
					vItem = rows1;	  
					var qiList="";
					var qiIndex = {};
					var tempQiId, temp;
					for(k in vItem) {
						tempQiId = vItem[k].qi_id.toString();
						console.log('tempId',tempQiId);
						if(k!=0) qiList = qiList.concat(",");
						qiList = qiList.concat(tempQiId) ;
						qiIndex["id".concat(tempQiId)] = k;
						vItem[k]['vList'] = new Array();
						console.log('qiList',qiList);						
					}
					console.log('qiIndex',qiIndex);
					console.log('vItem',vItem);
					var query2 = 
						"SELECT 	cs_id, qi_id, cs_option_order, cs_option_contents, cs_is_answer " +
						"FROM		T_CHOICE_SET " +
						"WHERE		qi_id in ( " + qiList + ") " +
						"ORDER BY	CS_OPTION_ORDER;"
						;
					console.log('query2',query2);
					//var row;
					conn.query(query2, function(err2, rows2, fields2) {
						if(!err2&&rows2){
							console.log('rows2:',rows2);
							for(m in rows2) {
								//temp = "id".concat(rows2[m].qi_id);
								tempQiId = qiIndex["id".concat(rows2[m].qi_id)];
								//console.log('temp',temp);
								//console.log('tempId',tempQiId);	
								//row = rows2[m];
								vItem[tempQiId].vList.push(rows2[m]);
							
								console.log('rows2[m]',m,":",rows2[m]);
								console.log('vItem',vItem);
							}
						}
						res.render('L050D020/update', { 
							user:user,
							message: message,
							ts_id:ts_id,
							vTSet:vTSet,
							vItem:vItem,
							mainCategories:mainCategories
						});
					});
					
					
					
					///////////MC-end//////////
				}
				else {
					console.log('Error while performing Query.', err); 
					res.render('L050D020/update', { 
						user:user,
						message: message,
						ts_id:ts_id,
						vTSet:vTSet,
						vItem:vItem,
						mainCategories:mainCategories
					});
				}
				
				
			});//end_query	
		  
	});

	
};


/////////////////////////////////////////////////////////////////////////
//
exports.create = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var ts_id=-1;
	var post = req.body;
	
	if(req.method == "GET"){
		//var dc_id_1st = gen1stMainDcId();
		var vItem = {	
			ts_title:'',
			ts_test_type:'O',
			ts_madeby_who:user.userId, 
			ts_time_limit:'60'
		};
		
		res.render('L050D020/create', { 
			user:user,
			message: message,
			ts_id:ts_id,
			vItem:vItem,
			mainCategories:mainCategories
		});
		
	}
	if(req.method == "POST"){
		
		var query1 = 
			"INSERT INTO t_test_set " + 
			"( ts_title, ts_test_type, ts_madeby_who , ts_time_limit ) " +
			"VALUES ( " + 
			"'" + post.ts_title.replace(/'/g,"''") 		+ "', " + 
			"'" + post.ts_test_type.replace(/'/g,"''") 	+ "', " + 
			"'" + post.ts_madeby_who.replace(/'/g,"''") 	+ "', " + 
			""+ post.ts_time_limit + "); " 
			;
			console.log("query1:",query1);
			
			conn.query(query1, function(err2, result2, fields2) 
			{
				if (!err2)	{	ts_id = result2.insertId;	}
				else 		{	message = '입력 중 에러 발생.';	}
				res.redirect('/L050D020/update/'+ts_id);
				
			});//query-end
	}
	
	
};