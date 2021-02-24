import $ from "jquery";
export const smoothScroll = () => {
  $('a[href^="#"]').click(function () {
    const speed = 600;
    const href = $(this).attr("href");
    const target = $(href == "#" || href == "" ? "html" : href);
    const position = target.offset().top - 75;
    $("body, html").delay(200).animate(
      {
        scrollTop: position,
      },
      speed,
      "swing"
    );
    return false;
  });
};
