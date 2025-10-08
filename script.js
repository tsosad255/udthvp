const canvas = document.getElementById("flagCanvas");
const ctx = canvas.getContext("2d");
const speedRange = document.getElementById("speedRange");

let waveSpeed = Number(speedRange.value);
let offset = 0;

function resizeCanvas() {
  // Sử dụng window.innerWidth/innerHeight thay vì getBoundingClientRect
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform trước khi scale
  ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 100);
});
resizeCanvas();

speedRange.addEventListener("input", () => {
  waveSpeed = Number(speedRange.value);
});

const flagImg = new Image();
flagImg.crossOrigin = "anonymous"; // Thêm để tránh lỗi CORS
flagImg.src = "https://flagcdn.com/w320/vn.png";

function drawWavingFlag(img, offset) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  // Calculate flag size to fill canvas and keep aspect ratio
  const aspect = img.width / img.height;
  let flagWidth = width;
  let flagHeight = height;

  if (width / height > aspect) {
    flagHeight = height;
    flagWidth = flagHeight * aspect;
  } else {
    flagWidth = width;
    flagHeight = flagWidth / aspect;
  }

  const xStart = (width - flagWidth) / 2;
  const yStart = (height - flagHeight) / 2;

  const waveAmplitude = Math.max(15, flagHeight * 0.04);
  const waveLength = Math.max(60, flagWidth * 0.15);

  // Tăng số lượng slices và cải thiện thuật toán để tránh gaps
  const slices = Math.max(150, Math.floor(flagWidth / 4));
  const sliceWidth = flagWidth / slices;

  for (let i = 0; i < slices; i++) {
    const sx = i * sliceWidth;
    const sw = sliceWidth + 1; // Thêm 1px để tránh gaps
    const dx = xStart + sx;

    // Cải thiện wave calculation
    const phase = sx / waveLength + offset;
    const dy =
      yStart +
      Math.sin(phase) * waveAmplitude +
      Math.cos(phase * 0.8) * (waveAmplitude * 0.25);

    // Đảm bảo không vẽ ra ngoài boundaries
    const actualSw = Math.min(sw, flagWidth - sx);
    if (actualSw > 0) {
      ctx.drawImage(
        img,
        (sx / flagWidth) * img.width,
        0,
        (actualSw / flagWidth) * img.width,
        img.height,
        dx,
        dy,
        actualSw,
        flagHeight
      );
    }
  }
}

function animate() {
  offset += 0.015 * waveSpeed;
  drawWavingFlag(flagImg, offset);
  requestAnimationFrame(animate);
}

flagImg.onload = () => {
  animate();
};

// Thêm event listener để resize khi orientation thay đổi
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 100);
});

const playMusicBtn = document.getElementById("playMusicBtn");
const prevMusicBtn = document.getElementById("prevMusicBtn");
const nextMusicBtn = document.getElementById("nextMusicBtn");
const flagAudio = document.getElementById("flagAudio");
const musicSelect = document.getElementById("musicSelect");

let isPlaying = false;

// Lấy danh sách các bài nhạc từ select
function getMusicOptions() {
  return Array.from(musicSelect.options).map((opt) => ({
    value: opt.value,
    text: opt.text,
  }));
}

function getCurrentMusicIndex() {
  return musicSelect.selectedIndex;
}

function setMusicIndex(idx, autoPlay = true) {
  const options = getMusicOptions();
  if (idx < 0) idx = options.length - 1;
  if (idx >= options.length) idx = 0;
  musicSelect.selectedIndex = idx;
  flagAudio.src = options[idx].value;
  flagAudio.pause();
  flagAudio.currentTime = 0;
  playMusicBtn.textContent = "Phát nhạc";
  isPlaying = false;
  if (autoPlay) {
    flagAudio
      .play()
      .then(() => {
        playMusicBtn.textContent = "Tạm dừng nhạc";
        isPlaying = true;
      })
      .catch(() => {
        playMusicBtn.textContent = "Phát nhạc";
        isPlaying = false;
      });
  }
}

// Sự kiện chuyển bài trước
prevMusicBtn.addEventListener("click", () => {
  let idx = getCurrentMusicIndex();
  setMusicIndex(idx - 1, true);
});

// Sự kiện chuyển bài tiếp
nextMusicBtn.addEventListener("click", () => {
  let idx = getCurrentMusicIndex();
  setMusicIndex(idx + 1, true);
});

// Khi chọn bài từ select, tự động phát
musicSelect.addEventListener("change", () => {
  setMusicIndex(getCurrentMusicIndex(), true);
});

playMusicBtn.addEventListener("click", () => {
  if (isPlaying) {
    flagAudio.pause();
    playMusicBtn.textContent = "Phát nhạc";
  } else {
    flagAudio.play();
    playMusicBtn.textContent = "Tạm dừng nhạc";
  }
  isPlaying = !isPlaying;
});

// Khi hết bài, tự động phát bài tiếp theo, lặp lại danh sách
flagAudio.addEventListener("ended", () => {
  let idx = getCurrentMusicIndex();
  setMusicIndex(idx + 1, true);
});

// Tự động phát nhạc đầu tiên khi load trang
window.addEventListener("DOMContentLoaded", () => {
  setMusicIndex(0, true);
});

const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");

let panelOpen = true;
settingsToggle.addEventListener("click", () => {
  panelOpen = !panelOpen;
  if (panelOpen) {
    settingsPanel.classList.remove("hide");
    settingsToggle.classList.add("open");
  } else {
    settingsPanel.classList.add("hide");
    settingsToggle.classList.remove("open");
  }
});
