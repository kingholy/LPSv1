
var lib = require('./lib/user');

var mysql = require('mysql');
var dbconfig   = require('./config/dbconfig.js');
var conn = mysql.createConnection(dbconfig);
conn.connect();


var util = require('util');
var zNodes = '';
var sPID;
var sID;
var contents;
var categories;

var query = 
	"SELECT 		"+
	"DC_ID, DC_CATEGORY_TYPE, DC_MAIN_CATEGORY,  DC_SUB_CATEGORY, DC_CATEGORY_NAME, DC_IS_QUEST "+
	"FROM		T_BOOK_CATEGORIES " +
	"ORDER BY	DC_MAIN_CATEGORY, DC_SUB_CATEGORY, DC_CATEGORY_TYPE"
;

conn.query(query, function(err, rows, fields) {
	  if (!err)	{
		  categories = rows;
		  
		  for (i in categories) {
			  sPID = categories[i].DC_MAIN_CATEGORY;
			  sID  = categories[i].DC_SUB_CATEGORY;
			  if(categories[i].DC_CATEGORY_TYPE == '1'){
		  		sPID = '0';
		  		sID = categories[i].DC_MAIN_CATEGORY;
			  }
		  	contents = 
		  		util.format('{ id:%s, pId:%s, name:\'%s\', open:true, url:\'/paper/%s.htm#dc_id%s\',  target:\'sContents\'}, ',
		  				sID,
		  				sPID,
		  				categories[i].DC_CATEGORY_NAME,
		  				categories[i].DC_MAIN_CATEGORY,
		  				categories[i].DC_ID);
		  	zNodes = zNodes + contents;
		  }
	  }
	  else		{
		  console.log('Error while performing Query.', err);
	  }
});
conn.end();

/////////////////////////////////////////////////////////////////////////
//
exports.index = function(req, res){
	var user = lib.getUserData(req);
	
	res.render('L040D010/index', 
	{ 
		user:user,
  		title: 'Python프로그래밍 학습 시스템',
  		zNodes: zNodes  		
  	});
};

