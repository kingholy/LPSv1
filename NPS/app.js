
/**
 * Module dependencies.
 */

var express = require('express')
	,routes = require('./routes')
	,home = require('./routes/home')
	,L040D010 = require('./routes/L040D010')
	,L040D020 = require('./routes/L040D020')
	,L030D010 = require('./routes/L030D010')
	,L030D020 = require('./routes/L030D020')
	,L050D010 = require('./routes/L050D010')
	,L050D020 = require('./routes/L050D020')
	,L050D021 = require('./routes/L050D021')
	,http = require('http')
	,path = require('path');



///////// flash  메시지 관련 /////////// 
var flash = require('connect-flash');

var app = express();
var app_port = 3000;

global.global_title = 'Python 프로그래밍 학습 시스템';
app.global_title = 'Python 프로그래밍 학습 시스템';
///////// logger /////////// 

var skipLog = {'.gif':1, '.png':1, '.jpg':1, '.svg':1, '.css':1, '.ttf':1, '.ico':1};
//app.use(express.logger('dev'));
app.use( express.logger('dev',{skip:function(req,res)	{ var ext = path.extname(req.url); return skipLog[ext];
		}}));

///////// environments /////////// 
app.set('port', process.env.PORT || app_port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
//app.use(app.router);

//var cookieParser = require('cookie-parser');
//app.use(cookieParser);
var bodyParser = require('body-parser');
//app.use(express.bodyParser());
//app.use(express.cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

//session 관련 셋팅
var session = require('express-session');
app.use(session({
    secret: 'lps',
    resave: false,
    saveUninitialized: true,
    cookie: {  
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));

//passport 적용
//var passport = require('passport');
//app.use(passport.initialize());
//app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

///////// development only /////////// 
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

///////// Routes /////////// 
app.get('/', routes.index);
app.get('/login', routes.index);//call for login page
app.post('/login', routes.index);//call for login post

app.get('/welcome', home.welcome);//call for  welcome page

app.get('/L030D010', L030D010.list);
app.get('/L030D010/list', L030D010.list);
app.post('/L030D010/list', L030D010.list);

app.get('/L030D020', L030D020.index);
app.get('/L030D020/index', L030D020.index);
app.post('/L030D020/index', L030D020.index);//call for login post
app.post('/L030D020/Update', L030D020.Update);//call for login post
app.get('/L030D020/Item', L030D020.Item);//call for login post
app.get('/L030D020/Item/:id', L030D020.Item);//call for login post

app.get('/L040D010', L040D010.index);
app.get('/L040D010/index', L040D010.index);

app.get('/L040D020', L040D020.list);
app.get('/L040D020/list', L040D020.list);
app.get('/L040D020/exam/:dc_id', L040D020.exam);
app.post('/L040D020/answer', L040D020.answer);

app.get('/L050D010', L050D010.list);
app.get('/L050D010/list', L050D010.list);
app.get('/L050D010/exam/:ts_id', L050D010.exam);
app.post('/L050D010/answer', L050D010.answer);

app.get('/L050D020', L050D020.create);
app.get('/L050D020/create', L050D020.create);
app.post('/L050D020', L050D020.create);
app.post('/L050D020/create', L050D020.create);

app.get('/L050D020/update/:ts_id', L050D020.update);
app.post('/L050D020/update', L050D020.update);
app.post('/L050D020/update/:ts_id', L050D020.update);

app.get('/L050D020/add/:ts_id', L050D020.add);
app.post('/L050D020/add', L050D020.add);
app.post('/L050D020/insert', L050D020.insert);
app.post('/L050D020/delete/:qs_id', L050D020.delete);

app.get('/L050D021/list', L050D021.list);



///////// SERVER start /////////// 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


	

///////// functions //////////////
app.locals.genQuestOption = function(selectedMenu){
	// 객관식: 'MC', 단답형: 'ST', 주관식: 'VL'
	var MenuQuestValueList = ['MC', 'ST', 'VL'];
	var MenuQuestNameList = ["객관식 문항","단답형 문항","코드작성 문항"];
	var rst="", value, name, sel;
	console.log('[genQuestOption]selectedMenu',selectedMenu);
	for(i=0;i<3;i++) {		
		value = MenuQuestValueList[i];
		name = MenuQuestNameList[i];
		sel = (value ==selectedMenu)? " selected " : "";				
		rst = rst + "<option value='" + value + "'" + sel + ">" + name + "</option>";
	}
	return rst;
};



app.locals.genMenuTimeLimit = function(selectedMenu){
	// 제한 시간 
	var MenuQuestValueList = ['30', '45', '50', '60', '90' ];
	var MenuQuestNameList = ["30분","45분","50분","60분","1시간"];
	var rst="", value, name, sel;
	console.log('[getMenuTimeLimit]selectedMenu',selectedMenu);
	for(i=0;i<5;i++) {		
		value = MenuQuestValueList[i];
		name = MenuQuestNameList[i];
		sel = (value ==selectedMenu)? " selected " : "";				
		rst = rst + "<option value='" + value + "'" + sel + ">" + name + "</option>";
	}
	return rst;
};




app.locals.genTestTypeOption = function(selectedMenu){
	// 임의(자가시험): 'I', 퀴즈: 'Q', 정규: 'O'
	var MenuQuestValueList = ['I', 'Q', 'O'];
	var MenuQuestNameList = ["임의시험","퀴즈","정규"];
	var rst="", value, name, sel;
	console.log('[genTestTypeOption]selectedMenu',selectedMenu);
	for(i=0;i<3;i++) {		
		value = MenuQuestValueList[i];
		name = MenuQuestNameList[i];
		sel = (value ==selectedMenu)? " selected " : "";				
		rst = rst + "<option value='" + value + "'" + sel + ">" + name + "</option>";
	}
	return rst;
};

app.locals.getTestTypeOption = function(value){
	if(value=='I') return "임의시험";
	if(value=='Q') return "퀴즈";
	if(value=='O') return "정규시험";
	return "";
};


app.locals.getMenuQuestTitle = function(value){
	if(value=="MC") return "객관식 문항";
	if(value=="ST") return "단답형 문항";
	if(value=="VL") return "코드작성 문항";
	return "";
};

app.locals.getMenuQuestName = function(value){
	if(value=="MC") return "객관식";
	if(value=="ST") return "단답형";
	if(value=="VL") return "코드작성";
	return "";
};



app.locals.genSelCategoryMain= function(selectedMenu, categiries ) 
{
	
	
	var rst = "", iValue, name, sel;
	var mainCategoryList = categiries; //getMainCategories();
	
	for(n in mainCategoryList) {		
		name = mainCategoryList[n].dc_category_name;
		iValue = mainCategoryList[n].dc_id;
		sel = (iValue==selectedMenu)? " selected " : "";				
		rst = rst + "<option value='" + iValue + "'" + sel + ">" + name + "</option>";
	}
	return rst;
};

app.locals.getCategoryNameByDCID= function(dc_id, categiries ) 
{
	var dc_name="";
	for(n in categiries) {		
		//console.log('categiries[n].dc_id:',categiries[n].dc_id,"=",(parseInt(categiries[n].dc_id)==parseInt(dc_id))?true:false);
		if(categiries[n].dc_id == dc_id ) {
			dc_name = categiries[n].dc_category_name;
			break;
		}
	}
	return dc_name;
};

app.locals.genDifficultyOption= function(selectedMenu) 
{
	var MenuDifficultyValueList = ["60","75","90"];
	var MenuDifficultyNameList = ["하","중","상"];
	
	var rst="", value, name, sel; 
	
	for(i=0;i<3;i++) {		
		value = MenuDifficultyValueList[i];
		name = MenuDifficultyNameList[i];
		sel = (value==selectedMenu)? " selected " : "";				
		rst= rst+ "<option value='" + value + "'" + sel + ">" + name + "</option>";
	}
	return rst;
};


app.locals.getMenuDifficultyName = function(value){
	if(value=="60") return "하";
	if(value=="75") return "중";
	if(value=="90") return "상";
	return "";
};


app.locals.getUserId = function(user){
	var user_name = '';
	if(user != undefined) {
		//user_name = req.session.userId;
		user_name = user.userId;
	}
	console.log("user_name",user_name)
	
	return user_name;
};
app.locals.getUserPrivilege = function(user){
	var privileges = '';
	if(user != undefined) {
		privileges = user.privileges;
	}
	console.log("user_privileges",privileges)
	
	return privileges;
};


app.locals.getTop = function(user, menuId){
	isVisible = true;
	switch(menuId){
	case 'L020D010':	if(user.privileges =='T') isVisible = false;
						break;
	case 'L020D020':	if(user.privileges =='S') isVisible = false;
						break;
	case 'L020D030':	if(user.privileges =='S') isVisible = false;
						break;
	case 'L030D010':	if(user.privileges =='S') isVisible = false;
						break;
	case 'L050D010':	if(user.privileges =='T') isVisible = false;
						break;
	case 'L050D020':	if(user.privileges =='S') isVisible = false;
						break;
	default:
						break;
	}
		
	return isVisible;
};

