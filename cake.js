const $ = (s, r = document) => r.querySelector(s);
const candles = [...document.querySelectorAll('.candle')];
const blowButton = $('#blowButton');
const revealButton = $('#revealButton');
const finalNote = $('#finalNote');
const cakeCaption = $('#cakeCaption');
const hintText = $('#hintText');
let noteOpened = false;

// A gentle star field in the background.
const canvas = $('#cakeCosmos');
const ctx = canvas.getContext('2d');
let stars = [], w = 0, h = 0, ratio = 1;
function resize() {
  ratio = Math.min(devicePixelRatio || 1, 2);
  w = innerWidth; h = innerHeight;

  canvas.width = w * ratio; canvas.height = h * ratio;
  canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = Array.from({ length: Math.min(130, Math.floor(w / 8)) },
    () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + .25,
      a: Math.random() * .65 + .12, p: Math.random() * 6.28,
      s: Math.random() * .025 + .004
    })
  );
}
function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    s.p += s.s;
    const a = s.a * (.55 + Math.sin(s.p) * .45);

    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,190,208,${a})`; ctx.fill();
  }
  requestAnimationFrame(draw);
}

addEventListener('resize', resize, { passive: true });
resize();
draw();

function floatLove(count = 24) {
  const glyphs = ['♡', '♥', '✦', '✧', '✴'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');

    el.className = 'floating-love';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = `${20 + Math.random() * 60}vw`;
    el.style.top = `${48 + Math.random() * 22}vh`;
    el.style.fontSize = `${12 + Math.random() * 22}px`;
    el.style.setProperty('--drift', `${(Math.random() - .5) * 180}px`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3700);
  }
}

function confettiBurst(amount = 100) {
  const colors = ['#ff315f', '#ff8da8', '#ffd5df', '#e8bb74', '#fff1f5', '#b80d43'];
  for (let i = 0; i < amount; i++) {
    const el = document.createElement('i');

    el.className = 'confetti';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    el.style.setProperty('--fall', `${3.2 + Math.random() * 3.8}s`);
    el.style.setProperty('--drift', `${(Math.random() - .5) * 260}px`);
    el.style.animationDelay = `${Math.random() * .9}s`;

    document.body.appendChild(el); setTimeout(() => el.remove(), 8500);
  }
}
function blowCandle(candle) { candle.classList.add('out'); }

function updateCandles() {
  const allOut = candles.every(c => c.classList.contains('out'));
  if (allOut) {
    cakeCaption.textContent = 'Điều ước đã được gửi đi. Mong nó tìm đường đến với em. ♡';
    hintText.textContent = 'Một điều ước nhỏ đã bay lên bầu trời.';
    blowButton.innerHTML = 'Nến đã tắt rồi <span>♡</span>';
    blowButton.disabled = true;
    blowButton.style.opacity = '1';
    revealButton.hidden = false;
    confettiBurst(135);
    floatLove(34);
  }
}

candles.forEach(candle => candle.addEventListener('click', () => {
  if (!candle.classList.contains('out')) {
    blowCandle(candle); updateCandles();
  }
}));

blowButton.addEventListener('click', () => {
  candles.forEach((candle, i) => setTimeout(() => {
    blowCandle(candle);
    updateCandles();
  }, i * 180));

  floatLove(18);
});

revealButton.addEventListener('click', () => {
  if (noteOpened) return;

  noteOpened = true;

  finalNote.classList.add('open');
  finalNote.setAttribute('aria-hidden', 'false');
  revealButton.hidden = true;
  confettiBurst(80);
  floatLove(30);
  finalNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

revealButton.addEventListener('click', () => {
  if (noteOpened) return;

  noteOpened = true;

  finalNote.classList.add('open');
  finalNote.setAttribute('aria-hidden', 'false');
  revealButton.hidden = true;

  confettiBurst(80);
  floatLove(30);

  setTimeout(() => {
    const targetY =
      finalNote.getBoundingClientRect().top +
      window.pageYOffset -
      30;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }, 500);
});

$('#againButton').addEventListener('click', () => {
  candles.forEach(c => c.classList.remove('out'));

  blowButton.disabled = false;
  blowButton.style.opacity = '1';
  blowButton.innerHTML = 'Thổi nến & gửi điều ước <span>♡</span>';
  revealButton.hidden = true;
  finalNote.classList.remove('open');
  finalNote.setAttribute('aria-hidden', 'true');

  noteOpened = false;

  cakeCaption.textContent = 'Ba ngọn nến nhỏ, dành cho những điều em xứng đáng có được.';
  hintText.textContent = 'Em cũng có thể chạm vào từng ngọn nến.';
  floatLove(15);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('#backToTopButton').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
