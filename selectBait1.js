
Tampermonkey® by Jan Biniok
v4.11
	
Select Class Bait1
by You
1
// ==UserScript==
2
// @name         Select Class Bait1
3
// @namespace    http://tampermonkey.net/
4
// @version      0.1
5
// @description  Select Class Bait1
6
// @author       You
7
// @match        https://svuis.svuonline.org/SVUIS/std_class_assign.php?pid=32
8
// @grant        none
9
// ==/UserScript==
10
​
11
(function() {
12
    $( "td:contains('BAC101')" ).each(function(){if($(this).text() == 'BAC101') {$(this).parents().eq(6).attr('id', 'BAC101'); return; }});
13
    var classes = "<style>p{font-size:16px; color:#000; font-weight:bold;}</style><div style='position:fixed;left:85%;top:20%;'><p>BAC101 C2</p><br/><p>INT204 C5</p><br/><p>GHS101 C3</p><br/><p>GHS102 C1</p><br/><p>INT203 C2</p><br/><p>INT202 C7</p><br/><p>BMN202 C2</p><br/><p>BFB305 C4</p></div>";
14
    $('body').append(classes);
15
    window.location.href = "#BAC101";
16
})();
