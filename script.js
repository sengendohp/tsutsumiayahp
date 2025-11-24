const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("headerNav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active"); // バツ印切替
  nav.classList.toggle("active");       // メニュー右スワイプ表示
});
