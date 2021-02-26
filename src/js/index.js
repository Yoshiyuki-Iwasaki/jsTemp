import $ from "jquery";
import { viewport, switchViewport } from "./modules/_viewport";
import { accordion } from "./modules/_accordion";
import { backToTop, backToTopScroll } from "./modules/_backToTop";
import { smoothScroll } from "./modules/_smoothScroll";
import { hamburger } from "./modules/_hamburger";

$(function () {
  viewport();
  smoothScroll();
  accordion();
  backToTop();
  hamburger();
});

$(window).on("scroll", function () {
  backToTopScroll();
});

$(window).on("resize", function () {
  switchViewport();
});

$(window).on("load resize scroll", function () {});
