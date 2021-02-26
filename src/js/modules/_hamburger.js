import $ from "jquery";
export const hamburger = () => {
  $(".header__trigger").on("click", function () {
    $(this).toggleClass("js-active");
    $(".header__nav").toggleClass("js-active");
  });
};
