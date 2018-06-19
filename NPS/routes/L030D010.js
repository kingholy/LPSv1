
/*
 * 문항조회 page.
 */
var lib = require('./lib/user');
///////// database /////////// 
var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);

///////////////////////////////
//get main categiry-list
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
// get 1st dc_id
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
//
exports.list = function(req, res){

	var user = lib.getUserData(req);
	var post  = req.body;
	var message = '';
	var dc_id = '';
	var vList;
	
	if(req.method == "GET" || req.method == "POST"){
		var post  = req.body;
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
			"FROM		T_QUESTION_ITEM A  " + 
			"		LEFT JOIN	T_QUESTION_RANGE  B   " + 
			"		ON			A.qi_id=B.qi_id  " + 
			"WHERE		B.dc_id = "+ dc_id + " " + 
			"ORDER BY	A.qi_id; "
		;
		
		console.log("query:",query);
		conn.query(query, function(err, rows, fields) {
			if (!err && rows) {	 
				vList = rows;	  
			}
			else {
				console.log('Error while performing Query.', err);  
			}
			res.render('L030D010/list', { 
				user:user,
				message: message,
				dc_id:dc_id,
				vList:vList,
				mainCategories:mainCategories
			});
		});//end_query	
		
	}
	//else if(req.method == "POST") {
	//}
	else {
		res.render('L030D010/list', { 
			user:user,
			message: message,
			dc_id:dc_id,
			vList:vList,
			mainCategories:mainCategories
		});
	}
};

