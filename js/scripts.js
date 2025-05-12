const video0 = document.getElementById("video0");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const audio = document.getElementById("audio");
const buttonsContainer = document.getElementById("buttons-container");
const allLinks = document.querySelectorAll(".buttons-container a");
const unsupported = document.getElementById("unsupported-browser");
const fallback = document.getElementById("start-fallback");
const repeatButton = document.getElementById("repeat-button");
const footer = document.getElementById("footer");

const userAgent = navigator.userAgent.toLowerCase();
const isUnsupportedBrowser = /miuibrowser|miui|miwebview|heytap/.test(userAgent);

if (isUnsupportedBrowser) {
  unsupported.style.display = "flex";
  video0.style.display = "none";
  video1.style.display = "none";
  video2.style.display = "none";
  audio.remove();
  buttonsContainer.style.display = "none";
} else {
  video1.load();
  video2.load();

  allLinks.forEach(link => {
    link.setAttribute("tabindex", "-1");
    link.style.pointerEvents = "none";
    link.addEventListener("click", function (e) {
      if (this.classList.contains("inactive-link")) e.preventDefault();
    });
  });

  window.addEventListener("load", () => {
    video0.play().catch(err => {
      console.warn("Autoplay bloqueado:", err);
      fallback.style.display = "flex";
      fallback.addEventListener("click", () => {
        video0.play().then(() => {
          fallback.style.display = "none";
        }).catch(err => {
          console.error("No se pudo reproducir tras clic en fallback:", err);
        });
      });
    });
  });

  video0.addEventListener("ended", () => {
    video0.style.display = "none";
    video1.style.display = "block";
    video1.style.opacity = 1;
  });

  video1.addEventListener("click", function playVideo1() {
    if (video1.readyState >= 3) {
      video1.muted = false;
      video1.play();
      audio.play();
    } else {
      video1.addEventListener("canplaythrough", () => {
        video1.muted = false;
        video1.play();
        audio.play();
      }, { once: true });
    }
  });

  video1.addEventListener("ended", () => {
    video2.currentTime = 0;
    video2.style.display = "block";
    video2.play().then(() => {
      video2.style.opacity = 1;
      video1.style.opacity = 0;
      setTimeout(() => {
        video1.style.display = "none";
        buttonsContainer.classList.add("enabled");
        footer.classList.add("enabled");
        allLinks.forEach(link => {
          link.classList.remove("inactive-link");
          link.removeAttribute("tabindex");
          link.style.pointerEvents = "auto";
        });
      }, 1000);
    }).catch(err => console.error("Error al reproducir video2:", err));
  });

  repeatButton.addEventListener("click", () => {
    buttonsContainer.classList.remove("enabled");
    footer.classList.remove("enabled");
    allLinks.forEach(link => {
      link.classList.add("inactive-link");
      link.setAttribute("tabindex", "-1");
      link.style.pointerEvents = "none";
    });

    video2.pause();
    video2.style.opacity = 0;
    video2.style.display = "none";

    video1.style.display = "block";
    video1.style.opacity = 1;
    video1.currentTime = 0;
    video1.muted = true;

    audio.pause();
    audio.currentTime = 0;
  });

  document.addEventListener('contextmenu', e => e.preventDefault());
}
