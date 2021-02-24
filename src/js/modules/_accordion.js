import $ from "jquery";
export const accordion = () => {
  $("#lnkKHistory").on("click", () => {
    $("#kHistory").fadeIn();
  });

  $(".closeKHistory").on("click", () => {
    $("#kHistory").fadeOut();
  });
};
