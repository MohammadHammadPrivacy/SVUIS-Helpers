// ==UserScript==
// @name         My Courses Time
// @namespace    http://tampermonkey.net/
// @version      26-12-2022
// @description  My Courses Time
// @author       Mohammad Hammad
// @match        https://svuis.svuonline.org/SVUIS/course_time_tutor.php
// ==/UserScript==

(function () {
  function Arabic_Days(day) {
    if (day == "Saturday") return "السبت";
    if (day == "Sunday") return "الأحد";
    if (day == "Monday") return "الإثنين";
    if (day == "Tuesday") return "الثلاثاء";
    if (day == "Wednesday") return "الأربعاء";
    if (day == "Thursday") return "الخميس";
    if (day == "Friday") return "الجمعة";
    return "الدخل ليس يوماً صحيحاً";
  }
  function Ramadan_Hours(hour) {
    if (hour == "08:00") return "8:00";
    if (hour == "10:00") return "9:30";
    if (hour == "12:00") return "11:00";
    if (hour == "14:00") return "12:30";
    if (hour == "16:00") return "14:00";
    if (hour == "18:00") return "15:30";
    if (hour == "20:00") return "17:00";
    if (hour == "22:00") return "18:30";
    if (hour == "24:00" || hour == "00:00") return "20:00";
    return "الدخل ليس ساعةً صحيحة";
  }
  function Am_Pm_Time(hour) {
    var temp = "";
    hour = hour.split(":");
    if (parseFloat(hour[0]) < 12) {
      temp += parseFloat(hour[0]) % 12;
      if (parseFloat(hour[1]) == 30) temp += ",30";
      temp += " ص";
      return temp;
    }
    if (parseFloat(hour[0]) == 12) {
      temp += "12";
      if (parseFloat(hour[1]) == 30) temp += ",30";
      temp += " م";
      return temp;
    }
    if (parseFloat(hour[0]) == 24) {
      temp += "12";
      if (parseFloat(hour[1]) == 30) temp += ",30";
      temp += " ص";
      return temp;
    }
    if (parseFloat(hour[0]) > 12) {
      temp += parseFloat(hour[0]) % 12;
      if (parseFloat(hour[1]) == 30) temp += ",30";
      temp += " م";
      return temp;
    }
  }
  document
    .getElementById("TableResult")
    .parentNode.setAttribute("id", "Course_Section");
  $("#Course_Section").html("");
  var boots =
    "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' ";
  boots +=
    "integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossorigin='anonymous'>";
  $("head").append(boots);
  var courses = [],
    new_courses = [];
  var SelectedProgram = 23 /* MWS */,
    SelectedCourse = [
      403, 404, 405, 406, 407,
    ] /* GMA101 - GMA204 - GMA205 - IPI405,*/,
    ENGProgram = 7 /* ENG */,
    L5 = 236; /* L5 */
  function GetCourseResultSS(Prog, Course, Term) {
    var AjaxData = "";
    AjaxData =
      "act=resultcourse&program=" +
      Prog +
      "&term=" +
      Term +
      "&course=" +
      Course;
    $.ajax({
      type: "POST",
      async: false,
      url: "https://svuis.svuonline.org/SVUIS/course_time_tutor_ajax.php",
      contentType: "application/x-www-form-urlencoded;charset=windows-1256",
      data: AjaxData,
      success: function (msg) {
        var html = new DOMParser().parseFromString(msg, "text/html");
        var condition = $("b", html).text();
        if (condition == " لا يوجد صفوف حالياً لهذه المادة ") return 0;
        else {
          var length = $("#TableResult tr", html).length;
          for (var i = 2; i < length; i++) {
            var time = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(1)
              .text()
              .split("_");
            var cclass = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(2)
              .text()
              .split("_");
            cclass = cclass[1] + " " + cclass[2];
            var mail = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(3)
              .text()
              .replace(/\s/g, "");
            var font = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(4)
              .find("font")
              .eq(0)
              .attr("color");
            if (font == "red")
              $("#TableResult", html)
                .find("tr")
                .eq(i)
                .find("td")
                .eq(4)
                .find("font")
                .eq(0)
                .attr("color", "#0088FF");
            var name = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(4)
              .html();
            var qty = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(5)
              .text();
            time[0] = Arabic_Days(time[0]);
            var new_time1 = Am_Pm_Time(Ramadan_Hours(time[1])),
              new_time2 = Am_Pm_Time(Ramadan_Hours(time[2]));
            time[1] = Am_Pm_Time(time[1]);
            time[2] = Am_Pm_Time(time[2]);
            var newest_time = time[0] + " " + new_time1 + " - " + new_time2;
            time = time[0] + " " + time[1] + " - " + time[2];
            courses.push({
              Time: time,
              Class: cclass,
              Mail: mail,
              Name: name,
              Qty: qty,
            });
            new_courses.push({
              Time: newest_time,
              Class: cclass,
              Mail: mail,
              Name: name,
              Qty: qty,
            });
          }
        }
      },
    });
  }
  for (var i = 0; i < SelectedCourse.length; i++) {
    GetCourseResultSS(SelectedProgram, SelectedCourse[i], 42 /* termId */);
  }
  var arr = [],
    arr_new = [];
  function GetCourseResultENG(Prog, Course, Term) {
    var AjaxData = "";
    AjaxData =
      "act=resultcourse&program=" +
      Prog +
      "&term=" +
      Term +
      "&course=" +
      Course;
    $.ajax({
      type: "POST",
      async: false,
      url: "https://svuis.svuonline.org/SVUIS/course_time_tutor_ajax.php",
      contentType: "application/x-www-form-urlencoded;charset=windows-1256",
      data: AjaxData,
      success: function (msg) {
        var html = new DOMParser().parseFromString(msg, "text/html");
        var condition = $("b", html).text();
        if (condition == " لا يوجد صفوف حالياً لهذه المادة ") return 0;
        else {
          var length = $("#TableResult tr", html).length;
          for (var i = 2; i < length; i++) {
            var time = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(1)
              .text()
              .split("_");
            var cclass = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(2)
              .text()
              .split("_");
            cclass = cclass[1] + " " + cclass[2];
            var mail = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(3)
              .text()
              .replace(/\s/g, "");
            var font = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(4)
              .find("font")
              .eq(0)
              .attr("color");
            if (font == "red")
              $("#TableResult", html)
                .find("tr")
                .eq(i)
                .find("td")
                .eq(4)
                .find("font")
                .eq(0)
                .attr("color", "#0088FF");
            var name = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(4)
              .html();
            var real_name = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(4)
              .text();
            var qty = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(5)
              .text();
            time[0] = Arabic_Days(time[0]);
            var new_time1 = Am_Pm_Time(Ramadan_Hours(time[1])),
              new_time2 = Am_Pm_Time(Ramadan_Hours(time[2]));
            time[1] = Am_Pm_Time(time[1]);
            time[2] = Am_Pm_Time(time[2]);
            var newest_time = time[0] + " " + new_time1 + " - " + new_time2;
            time = time[0] + " " + time[1] + " - " + time[2];
            courses.push({
              Time: time,
              Class: cclass,
              Mail: mail,
              Name: name,
              Qty: qty,
            });
            new_courses.push({
              Time: newest_time,
              Class: cclass,
              Mail: mail,
              Name: name,
              Qty: qty,
            });
          }
        }
      },
    });
  }
  //GetCourseResultENG(ENGProgram, L5, 40);
  var todays = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  var times = ["8 ص", "10 ص", "12 م", "2 م", "4 م", "6 م", "8 م", "10 م"];
  var results = [],
    new_results = [];
  var courses_days = [7],
    new_courses_days = [7];
  for (i = 0; i < 7; i++)
    (courses_days[i] = []),
      (new_courses_days[i] = []),
      (courses_days[i].day = todays[i]);
  for (i = 0; i < todays.length; i++) {
    for (var j = 0; j < times.length; j++) {
      for (var k = 0; k < courses.length; k++) {
        var time = courses[k].Time.split(" "),
          cla = courses[k].Class;
        if (time[0] != todays[i]) {
          continue;
        }
        time = time[1] + " " + time[2];
        if (time != times[j]) {
          continue;
        } else {
          var c = courses[k];
          courses_days[i].push({
            Time: c.Time,
            Class: c.Class,
            Mail: c.Mail,
            Name: c.Name,
            Qty: c.Qty,
          });
          var cc = new_courses[k];
          new_courses_days[i].push({
            Time: cc.Time,
            Class: cc.Class,
            Mail: cc.Mail,
            Name: cc.Name,
            Qty: cc.Qty,
          });
          courses.splice(k, 1);
          new_courses.splice(k, 1);
          k--;
        }
      }
    }
  }
  for (i = 0; i < courses_days.length; i++) {
    for (j = 0; j < courses_days[i].length - 1; j++) {
      if (courses_days[i][j].Class == courses_days[i][j + 1].Class) {
        courses_days[i][j].Name2 = courses_days[i][j + 1].Name;
        courses_days[i][j].Mail2 = courses_days[i][j + 1].Mail;
        courses_days[i].splice(j + 1, 1);
      }
    }
  }
  var xs = "<div class='container'>";
  for (i = 0; i < courses_days.length; i++) {
    if (courses_days[i].length > 0) {
      xs +=
        "<div class='row'><div class='col-md-2 retype'><span>" +
        courses_days[i].day +
        "</span></div>";
      for (j = 0; j < courses_days[i].length; j++) {
        var t = courses_days[i][j].Time.split(" ");
        xs +=
          "<div class='col-md-" +
          parseInt(10 / courses_days[i].length) +
          " sps' style='flex:0 0 " +
          (100 / 12) * parseFloat(10 / courses_days[i].length) +
          "%;max-width:" +
          (100 / 12) * parseFloat(10 / courses_days[i].length) +
          "%;' data-tutor='" +
          courses_days[i][j].Name +
          "' data-mail='" +
          courses_days[i][j].Mail +
          "' data-tutor2='" +
          courses_days[i][j].Name2 +
          "' data-mail2='" +
          courses_days[i][j].Mail2 +
          "' data-qty='" +
          courses_days[i][j].Qty +
          "' data-class='" +
          courses_days[i][j].Class +
          "' data-time='" +
          t[1] +
          " " +
          t[2] +
          " " +
          t[3] +
          " " +
          t[4] +
          " " +
          t[5] +
          "' data-time-ram='";
        t = new_courses_days[i][j].Time.split(" ");
        xs +=
          t[1] +
          " " +
          t[2] +
          " " +
          t[3] +
          " " +
          t[4] +
          " " +
          t[5] +
          "'><span>" +
          courses_days[i][j].Class +
          "</span></div>";
        t = new_courses_days[i][j].Time.split(" ");
      }
      xs += "</div>";
    }
  }
  xs += "</div>";
  xs +=
    "<style>.eliminate { display: none !important;} .row{direction:rtl;text-align:center; height:35px; margin-bottom:15px;} .row > div{border: solid 0.5px #F7D; padding: 0px; border-radius:8px;} .row > div > span{display: inline-block;padding-top: 5px;line-height:17px;} #Program_Data  p{float:right; padding-left:5px;} .row > p{text-align:center; font-size:18px; width:100%;} #Program_Data a:hover{color:blue;} .sps{cursor: no-drop;}</style>";
  xs +=
    "<button type='button' id='reset' style='position:fixed;top:3%;left:83.5%;width:12%;cursor:pointer;' class='form-control'>Reset</button>";
  xs +=
    "<form id='Program_Data' class='form-control' style='display:none;position:fixed;top:10%;left:79.5%;width:20%;direction:rtl;'><button type='button' class='close' style='float:left;' aria-label='Close'><span aria-hidden='true'>&times;</span></button><br/><div id='class'></div><hr><div id='time'></div><hr><div id='tutor'></div><hr><div id='mail'></div><hr><div id='qty'></div></form>";
  document.getElementById("Course_Section").innerHTML = xs;
  $("#TableResult").css("direction", "rtl");
  $("#TableResult").css("width", "100%");
  $(".sps").hover(
    function () {
      $("#class").html("<p>الصف: </p>" + $(this).attr("data-class"));
      $("#time").html("<p>التوقيت: </p>" + $(this).attr("data-time"));
      /*$("#time-ram").html(
        "<p>توقيت شهر رمضان: </p>" + $(this).attr("data-time-ram")
      );*/
      if ($(this).attr("data-tutor2") == "undefined") {
        $("#tutor").html("<p>المدرس: </p>" + $(this).attr("data-tutor"));
        $("#mail").html(
          "<p>البريد الإلكتروني: </p><a href='mailto:" +
            $(this).attr("data-mail") +
            "'>" +
            $(this).attr("data-mail") +
            "</a>"
        );
      } else {
        $("#tutor").html(
          "<p>المدرسين: </p>" +
            $(this).attr("data-tutor") +
            "<br/>" +
            $(this).attr("data-tutor2")
        );
        $("#mail").html(
          "<p>البريد الإلكتروني: </p><a href='mailto:" +
            $(this).attr("data-mail") +
            "'>" +
            $(this).attr("data-mail") +
            "</a><br/><a href='mailto:" +
            $(this).attr("data-mail2") +
            "'>" +
            $(this).attr("data-mail2") +
            "</a>"
        );
      }
      $("#qty").html("<p>نسبة التدريس: </p>" + $(this).attr("data-qty"));
      $("#Program_Data").show();
    },
    function () {}
  );
  $(".close").click(function () {
    $("#Program_Data").hide();
  });
  $("#reset").click(function () {
    $(".row").each(function (e) {
      var sessionsLength = $(this).children(".sps").length;
      $(this)
        .children(".sps")
        .each(function (e) {
          $(this).css(
            "flex",
            "0 0 " + (100 / 12) * parseFloat(10 / sessionsLength) + "%"
          );
          $(this).css(
            "max-width",
            (100 / 12) * parseFloat(10 / sessionsLength) + "%"
          );
        });
    });
    $(".row").removeClass("eliminate");
    $(".sps").removeClass("eliminate");
  });
  $(".row .sps").click(function () {
    $(this).addClass("eliminate");
    var len = $(this).siblings(".sps").not(".eliminate").length;
    if (len == 0) {
      $(this).parent().addClass("eliminate");
      return;
    }
    $(this)
      .siblings()
      .not(".retype")
      .css("flex", "0 0 " + (100 / 12) * parseFloat(10 / len) + "%");
    $(this)
      .siblings()
      .not(".retype")
      .css("max-width", (100 / 12) * parseFloat(10 / len) + "%");
  });
  left_panel.style.display = "none";
  left_panel_hide.style.display = "";
})();
