// ==UserScript==
// @name         My Classes Time
// @namespace    http://tampermonkey.net/
// @version      11-10-2020
// @description  مواعيد صفوفي
// @author       Mohammad Hammad
// @match        https://svuis.svuonline.org/SVUIS/std_classes.php
// @grant        none
// ==/UserScript==

(function() {
    /*var ur = document.URL;
    if(ur != "https://svuis.svuonline.org/SVUIS/std_classes.php") { return 0; }*/
    function Arabic_Days(day){
        if(day == "Saturday") {return "السبت";}
        else if(day == "Sunday") {return "الأحد";}
        else if(day == "Monday") {return "الإثنين";}
        else if(day == "Tuesday") {return "الثلاثاء";}
        else if(day == "Wednesday") {return "الأربعاء";}
        else if(day == "Thursday") {return "الخميس";}
        else if(day == "Friday") {return "الجمعة";}
    }
    function Ramadan_Hours(hour){
        if(hour == "08:00") return "8:00";
        else if(hour == "10:00") return "9:30";
        else if(hour == "12:00") return "11:00";
        else if(hour == "14:00") return "12:30";
        else if(hour == "16:00") return "14:00";
        else if(hour == "18:00") return "15:30";
        else if(hour == "20:00") return "17:00";
        else if(hour == "22:00") return "18:30";
        else if(hour == "24:00") return "20:00";
    }
    function Am_Pm_Time(hour){
        var temp = "";
        hour = hour.split(':');
        if(parseFloat(hour[0]) < 12) { temp += parseFloat(hour[0]) % 12; if(parseFloat(hour[1]) == 30) temp += ",30"; temp += " ص"; return temp;}
        if(parseFloat(hour[0]) == 12) { temp += "12"; if(parseFloat(hour[1]) == 30) temp += ",30"; temp += " م"; return temp;}
        if(parseFloat(hour[0]) == 24) { temp += "12"; if(parseFloat(hour[1]) == 30) temp += ",30"; temp += " ص"; return temp;}
        if(parseFloat(hour[0]) > 12) { temp += parseFloat(hour[0]) % 12; if(parseFloat(hour[1]) == 30) temp += ",30"; temp += " م"; return temp;}
    }
    function Prog_Id(name){
        if(name == 'ENG') return 7;
        if(name == 'BIT') return 8;
        if(name == 'BIT_Bridging') return 26;
        if(name == 'BAIT') return 32;
        if(name == 'BACT') return 33;
        if(name == 'TIC') return 37;
    }
    function Term_Id(name){
        if(name == 'F19') return 37;
        var SF = name[0], NUM = parseInt(name[1] + name[2]);
        NUM -= 19;
        if(SF == 'F') return 2 * NUM + 37;
        else return 2 * NUM + 36;
    }
    function Course_Id(name, program, term){
        var AjaxData = "act=course&program=" + program + "&term=" + term ;
        var res = "";
        $.ajax({
            type: "POST",
            async: false,
            url: "course_time_tutor_ajax.php",
            contentType: 'application/x-www-form-urlencoded;charset=windows-1256',
            data: AjaxData ,
            success: function(msg)
            {
                for(var i = msg.indexOf(name) - 10; i < msg.indexOf(name); i++){
                    res += msg[i];
                }
                res = res.split("'")[1];
            }
        });
        return parseInt(res);
    }
    var boots = "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' ";
    boots += "integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossorigin='anonymous'>";
    $('head').append(boots);
    var myclasses = "";
    var courses = [], new_courses = [];
    $('.tdhead_left_colored').eq(0).parents().eq(2).attr('id', 'Time');
    for(var i = 1; i < $('#Time tr').length; i++){
        myclasses += $('#Time').find('tr').eq(i).find('td').eq(2).text() + " ";
    }
    var courses_query = [];
    myclasses = myclasses.split(' ');
    for(var counter = 0; counter < myclasses.length - 1; counter++){
        var temp = myclasses[counter].split('_');
        if(temp[1] == 'BAAT' || temp[1] == 'PT' || temp[1] == 'BCT' || temp[1] == 'BAT') { continue; }
        if(temp[0] == 'ENG'){
            courses_query.push({
                "Program": Prog_Id(temp[0]),
                "Course": Course_Id(temp[1], Prog_Id(temp[0]), Term_Id(temp[3])),
                "Term": Term_Id(temp[3]),
                "Class": temp[2]
            });
        }
        else{
            courses_query.push({
                "Program": Prog_Id(temp[0]),
                "Course": Course_Id(temp[1], Prog_Id(temp[0]), Term_Id(temp[3])),
                "Term": Term_Id(temp[3]),
                "Class": temp[2]
            });
        }
    }
    function Class_Time(Prog, Course, term, cl)
    {
        var AjaxData = "";
		AjaxData = "act=resultcourse&program=" + Prog + "&term=" + term + "&course=" + Course;
		$.ajax({
            type: "POST",
			async: false,
            url: "https://svuis.svuonline.org/SVUIS/course_time_tutor_ajax.php",
            contentType: 'application/x-www-form-urlencoded;charset=windows-1256',
			data: AjaxData ,
			success: function(msg){
                var html = new DOMParser().parseFromString(msg, "text/html");
                var condition = $('b', html).text();
                if(condition == " لا يوجد صفوف حالياً لهذه المادة "){
                    return 0;
                }
                else{
                    var length = $('#TableResult tr', html).length;
                    for(var i = 2; i < length; i++){
                        var time = $('#TableResult', html).find('tr').eq(i).find('td').eq(1).text().split('_');
                        var cclass = $('#TableResult', html).find('tr').eq(i).find('td').eq(2).text().split('_');
                        if(!$('#TableResult', html).find('tr').eq(i).find('td').eq(2).text().includes(cl)) continue;
                        cclass = cclass[1] + " " + cclass[2];
                        var mail = $('#TableResult', html).find('tr').eq(i).find('td').eq(3).text();
                        var font = $('#TableResult', html).find('tr').eq(i).find('td').eq(4).find('font').eq(0).attr('color');
                        if(font == "red") $('#TableResult', html).find('tr').eq(i).find('td').eq(4).find('font').eq(0).attr('color', '#0088FF');
                        var name = $('#TableResult', html).find('tr').eq(i).find('td').eq(4).html();
                        var qty = $('#TableResult', html).find('tr').eq(i).find('td').eq(5).text();
                        time[0] = Arabic_Days(time[0]);
                        var new_time1 = Am_Pm_Time(Ramadan_Hours(time[1])), new_time2 = Am_Pm_Time(Ramadan_Hours(time[2]));
                        time[1] = Am_Pm_Time(time[1]);
                        time[2] = Am_Pm_Time(time[2]);
                        var newest_time = time[0] + " " + new_time1 + " - " + new_time2;
                        time = time[0] + " " + time[1] + " - " + time[2];
                        courses.push({"Time": time, "Class": cclass, "Mail": mail, "Name": name, "Qty": qty});
                        new_courses.push({"Time": newest_time});
                    }
                }
			}
		});
    }
    for(var e = 0; e < courses_query.length; e++){
        Class_Time(courses_query[e].Program, courses_query[e].Course, courses_query[e].Term, courses_query[e].Class);
    }
    var todays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
    var times = ["8 ص", "10 ص", "12 م", "2 م", "4 م", "6 م", "8 م", "10 م"];
    var courses_days = [7], new_courses_days = [7];
    for(i = 0; i < 7; i++){
      courses_days[i] = []; new_courses_days[i] = []; courses_days[i].day = todays[i];
    }
    for(i = 0; i < todays.length; i++){
        for(var j = 0; j < times.length; j++){
            for(var k = 0; k < courses.length; k++){
                var time = courses[k].Time.split(' '), cla = courses[k].Class;
                if(time[0] != todays[i]){
                    continue;
                }
                time = time[1] + " " + time[2];
                if(time != times[j]){
                    continue;
                }
                else{
                    var c = courses[k];
                    courses_days[i].push({"Time": c.Time, "Class": c.Class, "Mail": c.Mail, "Name": c.Name, "Qty": c.Qty});
                    var cc = new_courses[k];
                    new_courses_days[i].push({"Time": cc.Time});
                    courses.splice(k, 1);
                    new_courses.splice(k, 1);
                    k--;
                }
            }
        }
    }
    var xs = "<hr><div class='container' style='line-height:30px;background-color:#ADF;border-radius:10px;'><div class='row'><p>مواعيد عادية</p></div></div><div class='container'>";
    var xs2 = "<div class='container'>";
    for(i = 0; i < courses_days.length; i++){
        if(courses_days[i].length > 0){
            xs += "<div class='row'><div class='col-md-2'><span>" + courses_days[i].day + "</span></div>";
            xs2 += "<div class='row'><div class='col-md-2'><span>" + courses_days[i].day + "</span></div>";
            for( j = 0; j < courses_days[i].length; j++){
                var t = courses_days[i][j].Time.split(' ');
                xs += "<div class='col-md-" + parseInt(10 / courses_days[i].length) +" sps' style='flex:0 0 " + 100 / 12 * parseFloat(10 / courses_days[i].length) + "%;max-width:" + 100 / 12 * parseFloat(10 / courses_days[i].length) + "%;' data-tutor='" + courses_days[i][j].Name + "' data-mail='" + courses_days[i][j].Mail + "' data-qty='" + courses_days[i][j].Qty + "' data-class='" + courses_days[i][j].Class + "' data-time='" + t[1] + " " + t[2] + " " + t[3] + " " + t[4] + " " + t[5] + "'><span>" + courses_days[i][j].Class + "</span></div>";
                t = new_courses_days[i][j].Time.split(' ');
                xs2 += "<div class='col-md-" + parseInt(10 / courses_days[i].length) +" sps' style='flex:0 0 " + 100 / 12 * parseFloat(10 / courses_days[i].length) + "%;max-width:" + 100 / 12 * parseFloat(10 / courses_days[i].length) + "%;' data-tutor='" + courses_days[i][j].Name + "' data-mail='" + courses_days[i][j].Mail + "' data-qty='" + courses_days[i][j].Qty + "' data-class='" + courses_days[i][j].Class + "' data-time='" + t[1] + " " + t[2] + " " + t[3] + " " + t[4] + " " + t[5] + "'><span>" + courses_days[i][j].Class + "</span></div>";
            }
            xs += "</div>";
            xs2 += "</div>";
        }
    }
    xs += "</div>";
    xs2 += "</div>";
    xs += "<hr><div class='container' style='line-height:30px;background-color:#ADF;border-radius:10px;'><div class='row'><p>مواعيد شهر رمضان</p></div></div>" + xs2;
    xs += "<style>.row{direction:rtl;text-align:center; height:35px; margin-bottom:1px;} .row > div{border: solid 0.5px #F7D; padding: 0px; border-radius:8px;} ";
    xs += ".row > div > span{display: inline-block;padding-top: 5px;line-height:17px;} #Program_Data  p{float:right; padding-left:5px;} ";
    xs += ".row > p{text-align:center; font-size:18px; width:100%;}</style>";
    xs += "<form id='Program_Data' class='form-control' style='display:none;position:fixed;top:10%;left:80%;width:19%;direction:rtl;'>";
    xs += "<button type='button' class='close' style='float:left;' aria-label='Close'><span aria-hidden='true'>&times;</span></button><br/>";
    xs += "<div id='class'></div><hr><div id='time'></div><hr><div id='tutor'></div><hr><div id='mail'></div><hr><div id='qty'></div></form>";
    $('#Time').parents().eq(0).append(xs);
    $('#TableResult').css('direction', 'rtl');
    $('#TableResult').css('width', '100%');
    $(".sps").hover(function() {
        $('#class').html("<p>الصف: </p>" + $(this).attr('data-class'));
        $('#time').html("<p>التوقيت: </p>" + $(this).attr('data-time'));
        $('#tutor').html("<p>المدرس: </p>" + $(this).attr('data-tutor'));
        $('#mail').html("<p>البريد الإلكتروني: </p>" + $(this).attr('data-mail'));
        $('#qty').html("<p>نسبة التدريس: </p>" + $(this).attr('data-qty'));
        $('#Program_Data').show();
    }, function() {});
    $('.close').click(function(){
        $('#Program_Data').hide();
    });
    left_panel.style.display='none';
    left_panel_hide.style.display='';
    setTimeout(
        function() {
            $('#Time')[0].scrollIntoView({ behavior: 'smooth' });
            //window.location.href = "#Time";
        }, 2000);
    /*jQuery('#d3').hover(function(e){
    var jump = "#Time";
    var new_position = $(jump).offset();
    $('html, body').stop().animate({ scrollTop: new_position.top }, 500);
    e.preventDefault();
}, function() {});
    $('.close').click(function(){
        $('#Program_Data').hide();
    });*/
})();
