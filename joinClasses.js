// ==UserScript==
// @name         Select Classes MWS Automated Selection and Submitting
// @namespace    http://tampermonkey.net/
// @version      26-12-2022
// @description  Select Classes MWS Automated Selection and Submitting
// @author       Mohammad Hammad
// @match        https://svuis.svuonline.org/SVUIS/std_class_assign.php?pid=23
// @grant        none
// ==/UserScript==

(function () {
  // if server down should request the page again
  if (document.getElementsByTagName("b").length == 3)
    if (
      document.getElementsByTagName("b")[1].innerText ==
      "/home/www/config/config.php"
    )
      window.location.replace(
        "https://svuis.svuonline.org/SVUIS/std_class_assign.php?pid=23"
      );

  // give id to first course container
  const firstCourseName = "ADP";
  $(`td:contains('${firstCourseName}')`).each(function () {
    if ($(this).text() == firstCourseName) {
      $(this).parents().eq(6).attr("id", firstCourseName);
      return;
    }
  });

  // render needed classes
  const neededClasses = ["ADP_C1", "ADP_C1", "ADP_C1", "ADP_C1", "ADP_C1"];
  var classesHTML = `<style>p{font-size:16px; color:#000; font-weight:bold;}</style><div style='position:fixed;left:85%;top:20%;'>`;
  for (let classRoom of neededClasses) {
    classesHTML += `<p>${classRoom}</p><br/>`;
  }
  classesHTML += `</div>`;
  $("body").append(classesHTML);

  // select needed classes
  let readyToSubmit = false;
  for (const classRoom of neededClasses) {
    if ($(`select option:contains('${classRoom}')`).length) {
      $(`select option:contains('${classRoom}')`)
        .parent()
        .val($(`select option:contains('${classRoom}'):eq(0)`).val());
      readyToSubmit = true;
    }
  }

  // join classes
  setTimeout(function () {
    $(`#${firstCourseName}`)[0].scrollIntoView({ behavior: "smooth" });
    if (readyToSubmit) {
      $("form")[1].submit();
      alert("Joined successfully");
    } else alert("No classes to join");
  }, 0);
})();
