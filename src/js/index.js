import $ from "jquery";
import { viewport, switchViewport } from "./modules/_viewport";
import { accordion } from "./modules/_accordion";
import { backToTop, backToTopScroll } from "./modules/_backToTop";
import { smoothScroll } from "./modules/_smoothScroll";
import { humberger } from "./modules/_humberger";

$(function () {
  viewport();
  smoothScroll();
  accordion();
  backToTop();
  humberger();
});

$(window).on("scroll", function () {
  backToTopScroll();
});

$(window).on("resize", function () {
  switchViewport();
});

$(window).on("load resize scroll", function () {});
