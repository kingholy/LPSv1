
/*
 * 정규시험 list조회.
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
			"SELECT 	ts_id, ts_title, ts_test_type, ts_time_limit, DATE_FORMAT(update_at,'%Y-%m-%d') AS ts_update, '' as temp "+
			"FROM		t_test_set " +
			"WHERE		ts_madeby_who = '"+ user.userId + "' AND ts_test_type = 'O' ORDER BY ts_title; "
			;
		
		console.log('query',query);
		conn.query(query, function(err, rows) {
			if (!err &&  rows)	{	 
				vList= rows; console.log('rows:',rows);	  
				console.log("vList[0].ts_update:",vList[0].ts_update);
			}
			else 					{	 console.log('Error while performing Query.', err);	  }
			
			res.render('L050D021/list', { 
				user:user,
				message: message,
				vList:vList
			});
		});
	}//end-get
};

