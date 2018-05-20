//XMLHttpRequest 객체 가져오기
function getXMLHttpRequest() {
	
    if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");			//IE 상위 버젼
        } catch (e1) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");	//IE 하위 버젼
            } catch (e2) {
                return null;
            }
        }
        
    } else if (window.XMLHttpRequest) {
    	
        return new XMLHttpRequest();//IE 이외의 브라우저(FireFox 등)
        
    } else {
    	
        return null;
        
    }
    
}