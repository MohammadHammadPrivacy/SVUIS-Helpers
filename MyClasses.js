// ==UserScript==
// @name         My Classes Time
// @namespace    http://tampermonkey.net/
// @version      26-12-2022
// @description  My Classes Time
// @author       Mohammad Hammad
// @match        https://svuis.svuonline.org/SVUIS/std_classes.php
// @grant        none
// ==/UserScript==

(function () {
  function Arabic_Days(day) {
    switch (day) {
      case "Saturday":
        return "السبت";
      case "Sunday":
        return "الأحد";
      case "Monday":
        return "الإثنين";
      case "Tuesday":
        return "الثلاثاء";
      case "Wednesday":
        return "الأربعاء";
      case "Thursday":
        return "الخميس";
      case "Friday":
        return "الجمعة";
      default:
        return "يوم غير صحيح";
    }
  }
  function Ramadan_Hours(hour) {
    switch (hour) {
      case "08:00":
        return "08:00";
      case "10:00":
        return "09:30";
      case "12:00":
        return "11:00";
      case "14:00":
        return "12:30";
      case "16:00":
        return "14:00";
      case "18:00":
        return "15:30";
      case "20:00":
        return "17:00";
      case "22:00":
        return "18:30";
      case "24:00":
      case "00:00":
        return "20:00";
      default:
        return "توقيت غير صحيح";
    }
  }
  function Am_Pm_Time(hour) {
    var temp = "";
    hour = hour.split(":");
    var intHour = parseInt(hour[0]);
    var intMinute = parseInt(hour[1]);
    if (intHour < 12) {
      temp += intHour % 12;
      if (intMinute == 30) temp += ",30";
      temp += " ص";
      return temp;
    }
    if (intHour == 12) {
      temp += "12";
      if (intMinute == 30) temp += ",30";
      temp += " م";
      return temp;
    }
    if (intHour == 24) {
      temp += "12";
      if (intMinute == 30) temp += ",30";
      temp += " ص";
      return temp;
    }
    if (intHour > 12) {
      temp += intHour % 12;
      if (intMinute == 30) temp += ",30";
      temp += " م";
      return temp;
    }
  }
  function Prog_Id(name) {
    if (name == "ENG") return 7;
    if (name == "BIT") return 8;
    if (name == "BIT_Bridging") return 26;
    if (name == "BAIT") return 32;
    if (name == "BACT") return 33;
    if (name == "TIC") return 37;
    if (name == "MWS") return 23;
  }
  function Term_Id(name) {
    if (name == "F19") return 37;
    var SF = name[0],
      NUM = parseInt(name[1] + name[2]);
    NUM -= 19;
    if (SF == "F") return 2 * NUM + 37;
    else return 2 * NUM + 36;
  }
  function Course_Id(name, program, term) {
    var AjaxData = "act=course&program=" + program + "&term=" + term;
    var res = "";
    $.ajax({
      type: "POST",
      async: false,
      url: "course_time_tutor_ajax.php",
      contentType: "application/x-www-form-urlencoded;charset=windows-1256",
      data: AjaxData,
      success: function (msg) {
        for (var i = msg.indexOf(name) - 10; i < msg.indexOf(name); i++) {
          res += msg[i];
        }
        res = res.split("'")[1];
      },
    });
    return parseInt(res);
  }
  var boots =
    "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' ";
  boots +=
    "integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossorigin='anonymous'>";
  $("head").append(boots);
  var myClasses = "";
  var courses = [],
    new_courses = [];
  $(".tdhead_left_colored").eq(0).parents().eq(2).attr("id", "Time");
  for (var i = 1; i < $("#Time tr").length; i++) {
    myClasses += $("#Time").find("tr").eq(i).find("td").eq(2).text() + " ";
  }
  var courses_query = [];
  myClasses = myClasses.split(" ");
  for (var counter = 0; counter < myClasses.length - 1; counter++) {
    var temp = myClasses[counter].split("_");
    if (
      temp[1] == "BAAT" ||
      temp[1] == "PT" ||
      temp[1] == "BCT" ||
      temp[1] == "BAT" ||
      temp[1] == "SAT"
    ) {
      continue;
    }

    courses_query.push({
      Program: Prog_Id(temp[0]),
      Course: Course_Id(temp[1], Prog_Id(temp[0]), Term_Id(temp[3])),
      Term: Term_Id(temp[3]),
      Class: temp[2],
    });
  }
  function Class_Time(Prog, Course, term, cl) {
    var AjaxData = "";
    AjaxData =
      "act=resultcourse&program=" +
      Prog +
      "&term=" +
      term +
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
        if (condition == " لا يوجد صفوف حالياً لهذه المادة ") {
          return 0;
        } else {
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
            if (
              !$("#TableResult", html)
                .find("tr")
                .eq(i)
                .find("td")
                .eq(2)
                .text()
                .includes(cl)
            )
              continue;
            cclass = cclass[1] + " " + cclass[2];
            var mail = $("#TableResult", html)
              .find("tr")
              .eq(i)
              .find("td")
              .eq(3)
              .text();
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
            new_courses.push({ Time: newest_time });
          }
        }
      },
    });
  }
  for (var e = 0; e < courses_query.length; e++) {
    Class_Time(
      courses_query[e].Program,
      courses_query[e].Course,
      courses_query[e].Term,
      courses_query[e].Class
    );
  }
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
  var courses_days = [7],
    new_courses_days = [7];
  for (i = 0; i < 7; i++) {
    courses_days[i] = [];
    new_courses_days[i] = [];
    courses_days[i].day = todays[i];
  }
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
          new_courses_days[i].push({ Time: cc.Time });
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
  var xs =
    "<div style='height:14px; background-image:url(images/dotted_pixel_horizontal.gif); width:100%; margin:10 0 10 0;'></div><div class='container'>";
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
    "<style>.row{direction:rtl;text-align:center; height:35px; margin-bottom:15px;} .row > div{border: solid 0.5px #F7D; padding: 0px; border-radius:8px;} .row > div > span{display: inline-block;padding-top: 5px;line-height:17px;} #Program_Data  p{float:right; padding-left:5px;} .row > p{text-align:center; font-size:18px; width:100%;} #Program_Data a:hover{color:blue;}</style>";
  xs +=
    "<form id='Program_Data' class='form-control' style='display:none;position:fixed;top:10%;left:79.5%;width:20%;direction:rtl;'><button type='button' class='close' style='float:left;' aria-label='Close'><span aria-hidden='true'>&times;</span></button><br/><div id='class'></div><hr><div id='time'></div><hr><div id='tutor'></div><hr><div id='mail'></div><hr><div id='qty'></div></form>";
  $("#Time").parents().eq(0).append(xs);
  $("#TableResult").css("direction", "rtl");
  $("#TableResult").css("width", "100%");
  $(".sps").hover(
    function () {
      $("#class").html("<p>الصف: </p>" + $(this).attr("data-class"));
      $("#time").html("<p>التوقيت: </p>" + $(this).attr("data-time"));
      if ($(this).attr("data-tutor2") == "undefined") {
        $("#tutor").html("<p>المدرس: </p>" + $(this).attr("data-tutor"));
        $("#mail").html(
          "<p>البريد الإلكتروني: </p><a href='mailto:" +
            $(this).attr("data-mail") +
            "'>" +
            $(this).attr("data-mail") +
            "</a>" +
            `<a title='copy' onclick="navigator.clipboard.writeText('${$(this)
              .attr("data-mail")
              .trim()}');" style="cursor:pointer; margin-left:10px">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"></path>
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"></path>
               </svg>
            </a>`
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
            "</a>" +
            `<a title='copy' onclick="navigator.clipboard.writeText('${$(this)
              .attr("data-mail")
              .trim()}');" style="cursor:pointer; margin-left:10px">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"></path>
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"></path>
               </svg>
            </a>` +
            "<br/><a href='mailto:" +
            $(this).attr("data-mail2") +
            "'>" +
            $(this).attr("data-mail2") +
            "</a>" +
            `<a title='copy' onclick="navigator.clipboard.writeText('${$(this)
              .attr("data-mail2")
              .trim()}');" style="cursor:pointer; margin-left:10px">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"></path>
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"></path>
               </svg>
            </a>`
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
  //left_panel.style.display='none';
  left_panel_hide.style.display = "";
  setTimeout(function () {
    $("#Time")[0].scrollIntoView({ behavior: "smooth" });
    //window.location.href = "#Time";
  }, 0);
})();
