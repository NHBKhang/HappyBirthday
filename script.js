const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Starfield / glowing particles
const canvas = $("#cosmos");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [], cw = 0, ch = 0, dpr = 1;
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth; ch = window.innerHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(160, Math.floor(cw / 7)) }, () => ({
      x: Math.random() * cw, y: Math.random() * ch,
      r: Math.random() * 1.35 + .2, alpha: Math.random() * .58 + .12,
      phase: Math.random() * Math.PI * 2, speed: Math.random() * .014 + .003,
      drift: (Math.random() - .5) * .08
    }));
  }
  function drawStars() {
    ctx.clearRect(0, 0, cw, ch);
    for (const s of stars) {
      s.phase += s.speed; s.y -= s.drift;
      if (s.y < -3) s.y = ch + 3;
      const alpha = s.alpha * (.62 + Math.sin(s.phase) * .38);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 177, 198, ${alpha})`; ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas(); drawStars();
}

// Reveal content on scroll
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 85}ms`;
    revealObserver.observe(el);
  });
} else $$(".reveal").forEach(el => el.classList.add('visible'));

// Envelope: open animation, then bring the letter into view
const envelopeWrap = $("#envelopeWrap");
const envelopeButton = $("#envelopeButton");
const letterPaper = $("#letterPaper");
if (envelopeButton && envelopeWrap && letterPaper) {
  envelopeButton.addEventListener("click", () => {
    if (envelopeWrap.classList.contains("letter-open")) return;

    envelopeButton.classList.add("open");

    window.setTimeout(() => {
      envelopeWrap.classList.add("letter-open");
      letterPaper.classList.add("open");
      letterPaper.setAttribute("aria-hidden", "false");

      setTimeout(() => {
        const scrollTarget = letterPaper;
        const rect = scrollTarget.getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - 40;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth"
        });

        setTimeout(() => {
          const newRect = scrollTarget.getBoundingClientRect();

          if (
            newRect.top > window.innerHeight ||
            newRect.bottom < 0
          ) {
            scrollTarget.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }, 800);

        if (typeof burstHearts === "function") {
          burstHearts(
            window.innerWidth / 2,
            window.innerHeight * 0.55,
            14
          );
        }
      }, 100);
    }, 650);
  });
}

// Gallery lightbox
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "Ảnh kỷ niệm";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$$(".photo-card").forEach(card => card.addEventListener("click", () => {
  const img = $("img", card);
  if (img) openLightbox(img.src, img.alt);
}));
$("#lightboxClose")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

// Secret note
$("#secretButton")?.addEventListener("click", () => {
  const message = $("#secretMessage");
  if (!message) return;
  const opened = message.classList.toggle("open");
  message.setAttribute("aria-hidden", String(!opened));
  $("#secretButton").innerHTML = opened ? "Gấp lời nhắn lại <span>♡</span>" : "Mở lời nhắn bí mật <span>♡</span>";
  if (opened) burstHearts(window.innerWidth / 2, window.innerHeight * .6, 20);
});

// Wishes: after the final wish, navigate to a completely separate birthday-cake page.
const wishLines = [
  "Mong mọi điều dịu dàng sẽ tìm đến em. ♡",
  "Mong em luôn tự hào về chính mình — anh thì luôn tự hào về em.",
  "Chúc em có thật nhiều lý do để cười, hôm nay và những ngày sau.",
  "Điều ước của anh: được góp mặt trong thật nhiều ngày hạnh phúc của em."
];
let wishCount = 0;
const wishButton = $("#wishButton");
const wishResult = $("#wishResult");
const wishProgress = $("#wishProgress");
if (wishButton && wishResult && wishProgress) wishButton.addEventListener("click", () => {
  if (wishCount >= wishLines.length) {
    window.location.href = "birthday-cake.html";
    return;
  }
  wishResult.classList.remove("show");
  wishResult.textContent = wishLines[wishCount];
  wishCount++;
  wishProgress.textContent = wishCount < wishLines.length
    ? `Một điều nhỏ dành cho em · ${wishCount} / ${wishLines.length}`
    : "Em đã nhận đủ những điều ước nhỏ của anh ♡";
  wishButton.innerHTML = wishCount < wishLines.length
    ? `Điều ước tiếp theo <span>♡</span>`
    : `Mở món quà cuối cùng <span>✦</span>`;
  window.setTimeout(() => wishResult.classList.add("show"), 40);
  burstHearts(window.innerWidth / 2, window.innerHeight * .72, 25);
});

function burstHearts(x, y, count = 18) {
  const glyphs = ["♡", "♥", "✦", "✧", "·"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const dx = (Math.random() - .5) * 300;
    const dy = -90 - Math.random() * 250;
    Object.assign(el.style, {
      position: "fixed", left: `${x}px`, top: `${y}px`, zIndex: 30,
      pointerEvents: "none", color: Math.random() > .4 ? "#ff7897" : "#ffd0dc",
      fontSize: `${12 + Math.random() * 18}px`, opacity: "1",
      transition: "transform 1.5s ease, opacity 1.5s ease"
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 160 - 80}deg)`;
      el.style.opacity = "0";
    });
    window.setTimeout(() => el.remove(), 1600);
  }
}

// Optional local music: add your licensed audio at assets/music/birthday.mp3
const audio = $("#backgroundMusic");
const musicToggle = $("#musicToggle");
if (audio && musicToggle) {
  audio.src = "assets/music/birthday.mp3";
  musicToggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.classList.add("playing");
        musicToggle.setAttribute("aria-label", "Tắt nhạc nền");
        musicToggle.title = "Tắt nhạc nền";
      } catch (error) {
        musicToggle.title = "Hãy thêm file assets/music/birthday.mp3 để bật nhạc.";
        musicToggle.classList.remove("playing");
      }
    } else {
      audio.pause(); musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-label", "Bật nhạc nền");
      musicToggle.title = "Bật nhạc nền";
    }
  });
  audio.addEventListener("ended", () => musicToggle.classList.remove("playing"));
}
