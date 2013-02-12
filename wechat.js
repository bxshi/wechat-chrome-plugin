
// CONSTANTS for class names

var CHAT_LIST = 'chatListColumn';
var UN_READ = 'unreadDot';
var NICKNAME = 'left name';
var AVATAR = 'avatar';
var BASEURL = document.URL.replace(/\/$/,'');

/**
 *  Get an object of message conditions
 *  Return data is {
 *		nickname:{
 *			avatar:'absolute URL of avatar',
 *			unRead:'unRead message count'
 *		}
 *	}
 **/
var getUnReadList = function(){
    var columns = document.getElementsByClassName(CHAT_LIST);
    var unReadList = {};
    for(var i = 0; i<columns.length; i++){
        var unRead = parseInt(columns[i].getElementsByClassName(UN_READ)[0].innerText);
        if(unRead){
            var nickname = columns[i].getElementsByClassName(NICKNAME)[0].innerText;
            var avatar = BASEURL+columns[i].getElementsByClassName(AVATAR)[0].getAttribute('src');
            unReadList[nickname]={'avatar':avatar,'unRead':unRead};
        }
    }

    return unReadList;
};


chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse){
        switch(message.method){
            case 'getUnReadList' :
                sendResponse({'unReadList':getUnReadList()});
                break;
        }
        return true;
    }
);