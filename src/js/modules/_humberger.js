import $ from "jquery";
export const humberger = () => {
  $(".header__trigger").on("click", function () {
    $(this).toggleClass("js-active");
    $(".header__nav").toggleClass("js-active");
  });
};
