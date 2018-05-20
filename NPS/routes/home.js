
/*
 * GET welcome page.
 */

/////////  HOME  ///////////
var lib = require('./lib/user');


exports.welcome = function(req, res){
	var user = lib.getUserData(req);
	var message = '';
	res.render('home/welcome', { 
		user:user,
		message: message
	});
};

