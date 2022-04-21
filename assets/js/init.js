$(document).ready(function() {
    var user = getCookie('login');
    if (user == 'admin') {
        $(".menu").append(getGuestMenu());
    } else if ( user == 'guest') {
        $(".menu").append(getGuestMenu());
    }


});
 

function getCookie(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function getGuestMenu() {
    menu_html = "<h1>test</h1>\n
    <li><a href='#inputs' id='m-input' data-theme='a' data-ajax='false' class='ui-btn-active'>Inputs</a></li> \n
    <li><a href='#outputs' id='m-output' data-theme='a' data-ajax='false'>Outputs</a></li> \n
    <li><a href='#networks' id='m-network' data-theme='a' data-ajax='false'>Network</a></li> \n
    <li><a href='#readers' id='m-reader' data-theme='a' data-ajax='false'>Reader</a></li> \n
    <li><a href='#configs' id='m-datetime' data-theme='a' data-ajax='false'>Datetime</a></li> \n
    <li><a href='#configs' id='m-log' data-theme='a' data-ajax='false'>Log</a></li> \n
    <li><a href='#configs' id='m-operator' data-theme='a' data-ajax='false'>Operator</a></li> \n
    <li><a href='#system' id='m-system' data-theme='a' data-ajax='false'>System</a></li> \n
    <li><a href='#configs' id='m-config' data-theme='a' data-ajax='false'>Configuration</a></li> \n
    ";

}

function getAdminMenu() {

}

