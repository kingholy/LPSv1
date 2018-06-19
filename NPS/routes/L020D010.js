
/*
 * 학습 현황 조회.
 */
var lib = require('./lib/user');
var util = require('util');
var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);
conn.on('error', error =>  console.log(error));



/////////////////////////////////////////////////////////////////////////
//
exports.list = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	var vList;
	
	if(req.method == "GET"){
		query = 
			"SELECT 	" +
			"us_username, us_first_name, us_last_name, "+
			"ifnull(getLastDcNameByUser(us_username),'') as dc_name_last ,  "+
            "ifnull(getLastTestScoreByUser(us_username),'') as score_last "+
			"FROM		T_USERS " +
			"WHERE		us_user_privileges = 'S' " +
			"ORDER BY	us_last_name + us_first_name ";
		
		console.log('query',query);
		conn.query(query, function(err, rows) {
			if (!err &&  rows)	{	 
				vList= rows; 
				console.log('rows:',rows);	  
			}
			else 					{	 
				console.log('Error while performing Query.', err);	  
			}
			
			res.render('L020D010/list', { 
				user:user,
				message: message,
				vList:vList
			});
		});
	}//end-get
};




/////////////////////////////////////////////////////////////////////////
//
exports.index = function(req, res){
	var user = lib.getUserData(req);
	var username = (req.params.id==undefined)?user.userId:req.params.id;
	var message = '';
	var vList;
	
	if(req.method == "GET"){
		query = 
			"SELECT  dc_id,  dc_category_name , " +
			"ifnull(getLastTestIByDcId('"+username+"', dc_id),0) as nCnt,  " +
			"ifnull(getLastTestScoreByDcId('"+username+"', dc_id),0) as nScore  " +
			"FROM (  " +
			"SELECT dc_id, dc_category_name   " +
			"FROM T_BOOK_CATEGORIES  " +
			"WHERE DC_CATEGORY_TYPE = '1'  " +
			"ORDER BY	DC_MAIN_CATEGORY, DC_SUB_CATEGORY, DC_CATEGORY_TYPE  " + 
			") A  ;"
			;
		
		console.log('query',query);
		conn.query(query, function(err, rows) {
			if (!err &&  rows)	{	 
				vList= rows; 
				console.log('rows:',rows);	  
			}
			else 					{	 
				console.log('Error while performing Query.\n', err);	  
			}
			
			res.render('L020D010/index', { 
				user:user,
				message: message,
				vList:vList
			});
		});
	}//end-get
};

