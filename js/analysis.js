(function() {
    if (document.referrer == "") {
        return;
    }
    var parser = document.createElement("a");
    parser.href = document.referrer;
    var domain = parser.host;
    var domainArray = domain.split(".");
    if (domainArray.length > 2) {
        domain = domainArray[domainArray.length - 2] + "." + domainArray[domainArray.length - 1];
    } else if (domainArray.length == 2) {} else {
        return;
    }
    if (domain == "" || domain == "xiaoqi.top") {
        return;
    }
    var ajax = new XMLHttpRequest();
    ajax.open("get", "/referrer/" + btoa(parser.host), true);
    ajax.send();
})()