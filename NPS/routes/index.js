
/*
 * GET home page.
 */

/////////  HOME  ///////////


exports.index = function(req, res){
	var message = '';
	var sess = req.session; 

	if(req.method == "POST"){
		var mysql = require('mysql');
		var dbconfig   = require('./config/dbconfig.js');
		var conn = mysql.createConnection(dbconfig);
		conn.connect();
		
		var post  = req.body;
		var name= post.user_name;
		var pass= post.password;
		console.log('user_name: ',post.user_name);
		console.log('password: ',post.password);
		
		var sql=
			"SELECT us_username, us_first_name, us_last_name, us_user_privileges " +
			"FROM t_users " +
			"WHERE us_username ='"+name+"' and us_password = '"+pass+"'";       
		console.log('sql: ',sql);
		
		conn.query(sql, function(err, rows, fields){ 
			if(rows && rows.length>0){
				req.session.userId = rows[0].us_username;
				req.session.first_name = rows[0].us_first_name;
				req.session.last_name = rows[0].us_last_name;
				req.session.user_privileges = rows[0].us_user_privileges;
				console.log(rows[0].us_username);
				res.redirect('/welcome');
			}
			else{
				message = '접근이 허용된 사용자가 아닙니다, 다시 로그인 해 주십시오!';
				res.render('index.ejs',{message: message});
			}
		});
		conn.end();
	} 
	else {
		res.render('index.ejs',{message: message});
	}         
};






