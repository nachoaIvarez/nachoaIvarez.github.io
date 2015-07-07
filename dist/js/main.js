"format es6";

import $ from "jquery" ;

$("main").click(function() {
  $(this).toggleClass("active");
  $(this).siblings("nav").toggleClass("active");
});
