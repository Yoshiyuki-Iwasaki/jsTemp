import $ from "jquery";
export const backToTop = () => {
  $("#js-pagetop").on("click", e => {
    e.preventDefault();
    $("html, body").delay(300).animate({ scrollTop: 0 }, 800);
  });
};

export const backToTopScroll = () => {
  const target = 200; // fadeInさせるwindowの高さ
  const pageTop = $("#js-pagetop"); // pageTop
  const scrollTop = $(window).scrollTop(); // スクロールトップ
  if (scrollTop > target) {
    pageTop.fadeIn("slow");
  } else {
    pageTop.fadeOut("slow");
  }
};
