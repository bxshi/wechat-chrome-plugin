/*Global variables*/

var notificationCache = {};

var checkInterval = 1000;
var reShowInterval = 5000;

/**
 * Delete cache, so all notification will be sent
 */
var clearUpNotificationCache = function(){
    notificationCache = {};
};

/**
 * Binding `onClick` function to notification,
 * when clicking, it will bring you to `WeChat` tab
 * @param tab   --  tab that contains `WeChat`
 * @param notification  --  Desktop notification object
 */
var bindTab2Notification = function(tab, notification){
    notification.onclick = function(){
        chrome.tabs.update(tab.id, {selected: true});
        clearUpNotificationCache();
    };
};

/**
 * If the notification is occurred after user checked wechat,
 * it will appear
 * @param tab   --  tab that contains `WeChat`
 * @param nickname  --  user's nickname, just used for identify
 * @param notification  --  Desktop notification object
 */
var showNotification = function(tab, nickname, notification){
    if (!notificationCache[nickname] || (new Date() - notificationCache[nickname])>reShowInterval){
        notificationCache[nickname] = new Date();
        bindTab2Notification(tab, notification);
        notification.show();

    }
};

/**
 * Construct desktop notification, and shows it
 * @param tab   --  tab that contains `WeChat`
 * @param avatar    --  users' avatar url, currently not working when construct
 * @param title --  currently is user's nickname
 * @param message   --  body text of notification
 */
var constructNotification = function(tab, avatar, title, message){
    var notification = webkitNotifications.createNotification(
        avatar, title, message
    );
    showNotification(tab, title, notification);
};

/**
 * Get unread list from content page, and do the notification stuff
 * @param tab   --  tab that contains `WeChat`
 */
var getUnReadList = function(tab){
    chrome.tabs.executeScript(tab.id, {'file':'wechat.js'}, function(){
        chrome.tabs.sendMessage(tab.id, {'method':'getUnReadList'}, function(response){
            var unReadList = response.unReadList;
            for(var nickname in unReadList){

                constructNotification(
                    tab,
                    unReadList[nickname].avatar,
                    nickname,
                    'You got '+unReadList[nickname].unRead+' messages'
                );

            }

        });
    });
};

/**
 * This will be called each time, in order to make sure wechat is still open
 */
var getWeChatTab = function(){
    chrome.tabs.query({'url':'https://web.wechatapp.com/'}, function(tabs){
        if(tabs.length){
            getUnReadList(tabs[0]);
        }else{
            chrome.tabs.query({'url':'https://wx.qq.com/'}, function(tabs){
                if(tabs.length){
                    getUnReadList(tabs[0]);
                }
            });
        }
    });
};

var workFlow = function(){
    setInterval(getWeChatTab, checkInterval);
};

workFlow();