
/////////////////////////////////////////////////////////
// LMS관련 추가 함수  


// 각  Servlet 메뉴명을 return 함 
function getMenuName(progID)
{		
	if(progID == "M000D010") {
		menu_name = "&nbsp;통합추이 ▷ 음성인식 사용추이 ";
	}
	else if(progID == "L010D010") {
		menu_name = "&nbsp;HOME ";
	}
	else if(progID == "L020D010") {
		menu_name = "&nbsp;학습 현황 ";
	}
	else if(progID == "L020D020") {
		menu_name = "&nbsp;학습자별 학습 현황 ";
	}
	else if(progID == "L030D010") {
		menu_name = "&nbsp;문항조회 ";
	}
	else if(progID == "L030D020") {
		menu_name = "&nbsp;문제등록 ";
	}
	else if(progID == "L030D030") {
		menu_name = "&nbsp;정규시험지작성 ";
	}
	else if(progID == "L040D010") {
		menu_name = "&nbsp;교재 학습 ";
	}
	else if(progID == "L040D020") {
		menu_name = "&nbsp;단원별 문제 풀기 ";
	}
	else if(progID == "L040D030") {
		menu_name = "&nbsp;단원별 코딩하기 ";
	}
	else if(progID == "L040D040") {
		menu_name = "&nbsp;정규시험 ";
	}
	
	else if(progID == "L050D010") {
		menu_name = "&nbsp;정규시험";
	}
	else if(progID == "L050D020") {
		menu_name = "&nbsp;정규시험지 작성";
	}
	else if(progID == "L050D021") {
		menu_name = "&nbsp;정규시험지 조회";
	}	
	else if(progID == "R010D010") {
		menu_name = "&nbsp;메인 ";
	}
	
	else {
		menu_name = " ";
	}
	document.write(menu_name);
}

function getMenuNameView(progID, viewOption)
{
	var myID = progID+"|"+viewOption;
	getMenuName(myID);
	
}


/////////////////////////////////////////////////////////

// 메뉴 이동 관련 스크립트 함수
function comGoMenu(contextRoot, progID, cmd) {
	
	var url = "";
	
	url += contextRoot + "/" + progID + "Servlet";
	url += (cmd.length > 0)? "?cmd=" + cmd : "";  
	
	document.location.href = url;
	
}

// Null 체크
function isNull(obj, msg) {
	if(obj.value == "") {
		if(msg) {
			alert(msg);
		}
		obj.focus();
		return true;
	}
	return false;
}

//한글체크
function isHangle(obj, msg){
	var bRet = true;

	for(var i=0; i<obj.value.length; i++) {
		if((obj.value.charCodeAt(i)) <= 128) {
			bRet = false;
			break;
		}
	}

	//한글이 아닐때 텍스트 오브젝트에 포커스..
	if(!(bRet)) {
		alert(msg);
		obj.select(obj.value.length);				
	}
	return bRet;
}

// 숫자 체크
function isNumber(obj, msg) {
	var str = obj.value;	
	if(str.length == 0)
		return false;
	for(var i=0; i < str.length; i++) {
		if(!('0' <= str.charAt(i) && str.charAt(i) <= '9')){
			alert(msg);
			obj.select(str.length);		
			obj.focus();
			return false;
		}
	}
	return true;
}

// 알파뱃 체크
function isAlphabet(obj, msg) {
	var str = obj.value;
	if(str.length == 0)
		return false;

	str = str.toUpperCase();
	for(var i=0; i < str.length; i++) {
		if(!('A' <= str.charAt(i) && str.charAt(i) <= 'Z')){
			alert(msg);
			obj.select(str.length);		
			obj.focus();
			return false;
		}
	}
	return true;
}

// too short
function isShort(obj, len, msg) {
	var str = obj.value;
	if(str.length < len) {
		if(msg) {
			alert(msg);	
		}
		obj.focus();
		obj.select();
		return true;
	}
	return false;
}



//left menu - sub's header title 
function addSubMenuHeader( sPathRoot, sTextSubMenu)
{
	var sClass = "submenu-header";
	//var sBgColor = "#7794B5";
	//var sBgColor = "#FF8200";
	//var sBgColor = "#FF9614";
	var sBgColor = "#FFA01E";
	var sWidth = "165";
	var sHtml = 
		"<table border=\"0\" width=\""+sWidth+"\" cellspacing=\"2\" cellpadding=\"0\" style=\"margin-left: 5px;\"> "
	+	"<tr> "
	+	"<td bgcolor=\""+ sBgColor +"\" width=\""+sWidth+"\" height=\"16\" nowrap valign=\"top\">  " 
	+	"<img src=\"" + sPathRoot + "/img/transparent.gif\" width=\"7\" height=\"12\" border=\"0\"> "
	+	"<span class=\"" + sClass + "\" > " + sTextSubMenu + " </span> "
	+	" </td> </tr>"
	+	"</table>";
	document.write(sHtml);
}


//left menu - sub's menu title 
function addSubMenu( sPathRoot, sServletId, sView, sTextSubMenu)
{
	var sBgColor = "#e6e6e6";
	var sClass = "submenu";
	var sImg = "rect_gray.gif";
	var sWidth = "165";	
	/*
	submenu-sel
	rect_yellow.gif
	*/
	var sHtml = 
		"<table border=\"0\" width=\""+sWidth+"\" cellspacing=\"2\" cellpadding=\"0\" style=\"margin-left: 5px;\"> "
	+	"<tr> "
	+	"<td bgcolor=\""+ sBgColor +"\" width=\""+sWidth+"\" height=\"16\" nowrap valign=\"top\">  " 
	+	"<img src=\"" + sPathRoot + "/img/"+sImg+"\" align=\"absmiddle\" border=\"0\"> "
	+	"<a href=\"javascript:comGoMenu('" + sPathRoot + "', '"+ sServletId +"', '"+ sView + "')\"  class=\"" + sClass + "\" > " 
	+ 	sTextSubMenu 
	+ 	" </a> "
	+	" </td> </tr>"
	+	"</table>";
	document.write(sHtml);
}






