
module.exports = 
{
	getUserData:function(req)
	{
		var user = {
				userId:'',
				privileges:'',
				first_name:'',
				last_name:''
		};
		
		
		user.userId = req.session.userId; 
		user.privileges = req.session.user_privileges; 
		user.first_name = req.session.first_name; 
		user.last_name = req.session.last_name; 
		
		///*
		user.userId = 'admin'; 
		user.privileges = 'A'; 
		user.first_name = '관리자';
		user.last_name = 'A';
		//*/
		/*
		user.userId = 'sarah'; 
		user.privileges = 'S'; 
		user.first_name = '사라';
		user.last_name = '주';
		*/
		/*
		user.userId = 'Cho'; 
		user.privileges = 'S'; 
		user.first_name = '주형';
		user.last_name = '조';
		*/
		
		console.log("user_name",user.userId)
		console.log("user_privileges",user.privileges)
		
		return user;
	}

};

