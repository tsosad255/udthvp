// ====== Cấu hình nhanh (có thể chỉnh) ======
const CONFIG = {
  QUESTIONS_PER_GAME: 10,
  TIME_PER_QUESTION: 30, // giây
  BASE_POINTS: 10,        // điểm cơ bản cho mỗi câu đúng
  MAX_SPEED_BONUS: 10,    // bonus tối đa nếu trả lời ngay lập tức. Đặt 0 nếu không muốn bonus
  SHUFFLE_QUESTIONS: true,
  SHUFFLE_OPTIONS: true,  // trộn thứ tự đáp án trong mỗi câu
  DIFFICULTY_QUOTAS: {    // đảm bảo mức độ khó đồng đều giữa các phiên
    NB: 4,  // Nhận biết
    TH: 4,  // Thông hiểu
    SL: 2   // Suy luận nhẹ
  },
  GOOGLE_SHEETS_ENDPOINT: "", // dán URL Web App (Apps Script) vào đây
  REQUIRE_CONSENT: false,     // nếu true: bắt buộc tick đồng ý mới cho bắt đầu
  THEME: "dark"               // "dark" hoặc "light"
};

// ====== Trạng thái trò chơi ======
const state = {
  sessionId: "",
  player: { name: "", email: "", mssv: "" },
  questions: [],
  startedAt: 0,
  totalElapsedSec: 0,
  currentIndex: 0,
  timer: { remain: CONFIG.TIME_PER_QUESTION, id: null },
  score: { base: 0, speedBonus: 0, get total(){ return this.base + this.speedBonus } },
  answers: [], // [{id, prompt, chosenIndex, correctIndex, correct, base, bonus, elapsedSec, tags, explanation }]
  rng: null
};

// ====== Tiện ích ======
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// RNG có seed theo sessionId để mỗi phiên khác nhau nhưng tái lập được nếu cần
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFromString(s) {
  const seedFn = xmur3(s);
  const seed = seedFn();
  return mulberry32(seed);
}
function shuffleRng(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function vibrate(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(e){}
}

// ====== Lấy câu hỏi theo mức độ khó (stratified) ======
function pickQuestionsStratified(bank, quotas, rng, totalNeed) {
  // Nhóm theo difficulty: NB, TH, SL (mặc định NB nếu thiếu)
  const buckets = { NB: [], TH: [], SL: [] };
  bank.forEach(q => {
    const d = (q.difficulty || "NB").toUpperCase();
    if (!buckets[d]) buckets[d] = [];
    buckets[d].push(q);
  });

  const chosen = [];
  // lấy theo quota
  for (const [d, need] of Object.entries(quotas)) {
    const pool = buckets[d] || [];
    const shuffled = shuffleRng(pool, rng);
    for (let i = 0; i < Math.min(need, shuffled.length); i++) {
      chosen.push(shuffled[i]);
    }
  }
  // nếu thiếu do ngân hàng không đủ -> bù từ phần còn lại
  if (chosen.length < totalNeed) {
    const remainingPool = bank.filter(q => !chosen.includes(q));
    const shuffled = shuffleRng(remainingPool, rng);
    while (chosen.length < totalNeed && shuffled.length) {
      chosen.push(shuffled.shift());
    }
  }
  // nếu thừa (quota > totalNeed) -> cắt bớt
  return chosen.slice(0, totalNeed);
}

// Trộn đáp án trong mỗi câu và cập nhật answerIndex
function withShuffledOptions(q, rng) {
  const idxs = q.options.map((_, i) => i);
  const shuffledIdxs = shuffleRng(idxs, rng);
  const newOptions = shuffledIdxs.map(i => q.options[i]);
  const newAnswerIndex = shuffledIdxs.indexOf(q.answerIndex);
  return { ...q, options: newOptions, answerIndex: newAnswerIndex };
}

// ====== View helpers ======
function switchView(id) {
  $$(".view").forEach(v => v.classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden");
  $(`#${id}`).classList.add("current");
}

function setTheme(mode) {
  const root = document.documentElement;
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");
}

// ====== Khởi tạo ======
window.addEventListener("DOMContentLoaded", () => {
  // Theme
  setTheme(CONFIG.THEME === "light" ? "light" : "dark");
  $("#btnTheme").addEventListener("click", () => {
    const light = !document.documentElement.classList.contains("light");
    setTheme(light ? "light" : "dark");
  });

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Form actions
  $("#btnStart").addEventListener("click", onStart);
  $("#btnNext").addEventListener("click", nextQuestion);
  $("#btnSend").addEventListener("click", sendToSheets);
  $("#btnDownload").addEventListener("click", downloadResult);
  $("#btnReplay").addEventListener("click", resetToLobby);
  $("#btnEditInfo").addEventListener("click", openEditModal);
  $("#btnEditCancel").addEventListener("click", closeEditModal);
  $("#formEditPlayer").addEventListener("submit", saveEditPlayer);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (!$("#view-game").classList.contains("hidden")) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) {
        const opts = $$("#options .option");
        const idx = n - 1;
        if (opts[idx]) opts[idx].click();
      } else if (e.key === "Enter") {
        const nextBtn = $("#btnNext");
        if (!nextBtn.disabled) nextBtn.click();
      }
    }
    if (e.key === "Escape" && !$("#modalMask").classList.contains("hidden")) {
      closeEditModal();
    }
  });
});

// ====== Gameplay ======
function onStart() {
  const name = $("#inpName").value.trim();
  const email = $("#inpEmail").value.trim();
  const mssv = $("#inpMssv").value.trim();
  const consent = $("#inpConsent").checked;

  if (!name || !email || !mssv) {
    alert("Vui lòng nhập đầy đủ Họ tên, Email và MSSV.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Email không hợp lệ.");
    return;
  }
  if (CONFIG.REQUIRE_CONSENT && !consent) {
    alert("Vui lòng đồng ý cho phép lưu trữ kết quả để tiếp tục.");
    return;
  }

  state.sessionId = uuid();
  state.player = { name, email, mssv };
  state.startedAt = Date.now();
  state.totalElapsedSec = 0;
  state.currentIndex = 0;
  state.timer = { remain: CONFIG.TIME_PER_QUESTION, id: null };
  state.score.base = 0;
  state.score.speedBonus = 0;
  state.answers = [];

  // RNG theo session
  state.rng = rngFromString(state.sessionId);

  // Lấy câu hỏi theo quota độ khó
  const bank = Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK.slice() : [];
  if (bank.length === 0) {
    alert("Chưa có câu hỏi trong QUESTION_BANK. Hãy mở file questions.js để thêm.");
    return;
  }

  let selected = pickQuestionsStratified(bank, CONFIG.DIFFICULTY_QUOTAS, state.rng, CONFIG.QUESTIONS_PER_GAME);
  if (CONFIG.SHUFFLE_QUESTIONS) selected = shuffleRng(selected, state.rng);
  if (CONFIG.SHUFFLE_OPTIONS) selected = selected.map(q => withShuffledOptions(q, state.rng));
  state.questions = selected;

  switchView("view-game");
  renderCurrent();
  startTimer();
}

function renderCurrent() {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  // HUD
  $("#txtProgress").textContent = `${state.currentIndex+1}/${state.questions.length}`;
  $("#txtScore").textContent = state.score.total;
  updateProgressLine();

  // Question
  $("#qText").innerHTML = q.prompt;
  $("#qTags").textContent = (q.tags && q.tags.join(" · ")) || "";
  const ol = $("#options");
  ol.innerHTML = "";

  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.className = "option";
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "0");
    li.dataset.index = i;

    const prefix = document.createElement("div");
    prefix.className = "prefix";
    prefix.textContent = String.fromCharCode(65+i); // A, B, C...

    const text = document.createElement("div");
    text.className = "text";
    text.innerHTML = opt;

    li.appendChild(prefix);
    li.appendChild(text);

    li.addEventListener("click", () => onChoose(i));
    li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") li.click(); });
    ol.appendChild(li);
  });

  $("#feedback").classList.add("hidden");
  $("#explanation").classList.add("hidden");
  $("#explanation").innerHTML = "";
  $("#btnNext").disabled = true;
}

function onChoose(i) {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  stopTimer();
  const elapsed = CONFIG.TIME_PER_QUESTION - state.timer.remain; // giây
  state.totalElapsedSec += elapsed;

  const correctIndex = q.answerIndex;
  const correct = (i === correctIndex);

  const base = correct ? CONFIG.BASE_POINTS : 0;
  const bonus = correct ? Math.round(CONFIG.MAX_SPEED_BONUS * (state.timer.remain / CONFIG.TIME_PER_QUESTION)) : 0;
  const gain = base + bonus;

  state.score.base += base;
  state.score.speedBonus += bonus;

  // UI reveal (không hiển thị chip điểm ở tuỳ chọn)
  const opts = $$("#options .option");
  opts.forEach((el, idx) => {
    el.dataset.state = (idx === correctIndex) ? "correct" : (idx === i ? "incorrect" : "");
  });

  const fb = $("#feedback");
  fb.classList.remove("hidden");
  fb.textContent = correct ? "Chính xác!" : "Sai mất rồi.";
  fb.className = `feedback ${correct ? "ok" : "bad"}`;

  const exp = $("#explanation");
  exp.classList.remove("hidden");
  const answerText = `${String.fromCharCode(65+correctIndex)}. ${q.options[correctIndex]}`;
  const awardCls = gain > 0 ? "award" : "award bad";
  const detail = gain > 0
    ? `(+${base} cơ bản${bonus>0?` + ${bonus} tốc độ`:""})`
    : "(0 điểm)";
  exp.innerHTML = `<strong>Đáp án đúng:</strong> ${answerText}<br>${q.explanation || ""}
    <div class="${awardCls}"><span class="tag">Điểm câu này</span><strong>+${gain}</strong> <span class="small">${detail}</span></div>`;

  $("#btnNext").disabled = false;
  $("#txtScore").textContent = state.score.total;

  // Haptic
  vibrate(correct ? 20 : [40, 40, 40]);

  // Scroll explanation into view for mobile
  exp.scrollIntoView({ behavior: "smooth", block: "end" });

  // Lưu câu trả lời
  state.answers.push({
    id: q.id, prompt: q.prompt, chosenIndex: i, correctIndex,
    correct, base, bonus, elapsedSec: elapsed, tags: q.tags || [],
    explanation: q.explanation || "", difficulty: q.difficulty || "NB"
  });
}

function startTimer() {
  state.timer.remain = CONFIG.TIME_PER_QUESTION;
  updateTimerRing();

  clearInterval(state.timer.id);
  state.timer.id = setInterval(() => {
    state.timer.remain -= 1;
    updateTimerRing();
    if (state.timer.remain <= 0) {
      clearInterval(state.timer.id);
      onTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timer.id);
}

function updateTimerRing() {
  const pct = clamp(state.timer.remain / CONFIG.TIME_PER_QUESTION, 0, 1);
  $("#timerRing").style.setProperty("--pct", pct.toFixed(4));
  $("#txtTimer").textContent = Math.max(0, state.timer.remain);
}

function onTimeout() {
  // Chấm như trả lời sai
  const q = state.questions[state.currentIndex];
  const correctIndex = q.answerIndex;
  state.totalElapsedSec += CONFIG.TIME_PER_QUESTION;

  // UI: mark incorrect (no chosen)
  const opts = $$("#options .option");
  opts.forEach((el, idx) => {
    el.dataset.state = (idx === correctIndex) ? "correct" : "incorrect";
  });

  const fb = $("#feedback");
  fb.classList.remove("hidden");
  fb.textContent = "Hết giờ!";
  fb.className = "feedback bad";

  const exp = $("#explanation");
  exp.classList.remove("hidden");
  const answerText = `${String.fromCharCode(65+correctIndex)}. ${q.options[correctIndex]}`;
  exp.innerHTML = `<strong>Đáp án đúng:</strong> ${answerText}<br>${q.explanation || ""}
    <div class="award bad"><span class="tag">Điểm câu này</span><strong>+0</strong> <span class="small">(0 điểm)</span></div>`;

  $("#btnNext").disabled = false;

  vibrate([60, 40, 60]); // haptic

  // Lưu
  state.answers.push({
    id: q.id, prompt: q.prompt, chosenIndex: null, correctIndex,
    correct: false, base: 0, bonus: 0, elapsedSec: CONFIG.TIME_PER_QUESTION, tags: q.tags || [],
    explanation: q.explanation || "", difficulty: q.difficulty || "NB"
  });
}

function nextQuestion() {
  state.currentIndex += 1;
  if (state.currentIndex >= state.questions.length) {
    updateProgressLine(1);
    return showSummary();
  }
  renderCurrent();
  startTimer();
}

function updateProgressLine(force1) {
  const bar = $("#lineProgress");
  if (!bar) return;
  const total = state.questions.length || CONFIG.QUESTIONS_PER_GAME;
  const ratio = force1 ? 1 : (state.currentIndex / total);
  bar.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}

function showSummary() {
  switchView("view-summary");

  const correctCount = state.answers.filter(a => a.correct).length;
  const acc = Math.round((correctCount / state.questions.length) * 100);

  $("#sumTotal").textContent = state.score.total;
  $("#sumBase").textContent = state.score.base;
  $("#sumSpeed").textContent = state.score.speedBonus;
  $("#sumAcc").textContent = `${acc}%`;
  $("#sumTime").textContent = `${state.totalElapsedSec}s`;
  $("#sumSession").textContent = state.sessionId;
  $("#sumName").textContent = state.player.name;
  $("#sumEmail").textContent = state.player.email;
  $("#sumMssv").textContent = state.player.mssv;

  const list = $("#reviewList");
  list.innerHTML = "";
  state.answers.forEach((a, idx) => {
    const item = document.createElement("details");
    item.className = "review-item";
    const title = document.createElement("summary");
    title.innerHTML = `<span class="badge ${a.correct ? "ok" : "bad"}">${a.correct ? "Đúng" : "Sai"}</span> Câu ${idx+1}: ${stripHTML(a.prompt)} <span class="badge">${a.difficulty}</span>`;
    const body = document.createElement("div");
    body.className = "body";
    const chosenTxt = a.chosenIndex!=null ? `${String.fromCharCode(65+a.chosenIndex)}. ${stripHTML(state.questions[idx].options[a.chosenIndex])}` : "—";
    const correctTxt = `${String.fromCharCode(65+a.correctIndex)}. ${stripHTML(state.questions[idx].options[a.correctIndex])}`;
    const gain = a.base + a.bonus;
    body.innerHTML = `
      <div><strong>Đã chọn:</strong> ${chosenTxt}</div>
      <div><strong>Đáp án đúng:</strong> ${correctTxt}</div>
      <div class="${gain>0 ? 'award' : 'award bad'}"><span class="tag">Điểm câu này</span><strong>+${gain}</strong> <span class="small">${gain>0?`(+${a.base} cơ bản${a.bonus>0?` + ${a.bonus} tốc độ`:''})`:"(0 điểm)"}</span></div>
      <div style="margin-top:6px">${a.explanation}</div>
    `;
    item.appendChild(title);
    item.appendChild(body);
    list.appendChild(item);
  });
}

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// ====== Modal edit info ======
function openEditModal() {
  $("#editName").value = state.player.name || "";
  $("#editEmail").value = state.player.email || "";
  $("#editMssv").value = state.player.mssv || "";
  $("#modalMask").classList.remove("hidden");
  $("#editName").focus();
}
function closeEditModal() {
  $("#modalMask").classList.add("hidden");
}
function saveEditPlayer(e) {
  e && e.preventDefault && e.preventDefault();
  const name = $("#editName").value.trim();
  const email = $("#editEmail").value.trim();
  const mssv = $("#editMssv").value.trim();
  if (!name || !email || !mssv) { alert("Vui lòng nhập đầy đủ Họ tên, Email, MSSV."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Email không hợp lệ."); return; }

  state.player = { name, email, mssv };
  $("#sumName").textContent = name;
  $("#sumEmail").textContent = email;
  $("#sumMssv").textContent = mssv;

  closeEditModal();
  try { if (navigator.vibrate) navigator.vibrate(15); } catch(e){}
}

function editInfo(){ openEditModal(); }

function resetToLobby() {
  switchView("view-lobby");
  // reset view game
  $("#txtProgress").textContent = `1/${CONFIG.QUESTIONS_PER_GAME}`;
  $("#txtScore").textContent = 0;
  $("#txtTimer").textContent = CONFIG.TIME_PER_QUESTION;
  $("#options").innerHTML = "";
  $("#feedback").classList.add("hidden");
  $("#explanation").classList.add("hidden");
  const bar = $("#lineProgress"); if (bar) bar.style.width = "0%";
}

// ====== Gửi dữ liệu sang Google Sheets (Apps Script) ======
async function sendToSheets() {
  const endpoint = CONFIG.GOOGLE_SHEETS_ENDPOINT;
  if (!endpoint) {
    alert("Chưa cấu hình GOOGLE_SHEETS_ENDPOINT trong app.js.\nHãy xem README.md để tạo Apps Script và dán URL vào.");
    return;
  }
  $("#sendStatus").textContent = "Đang gửi...";
  const correctCount = state.answers.filter(a => a.correct).length;
  const payload = {
    sessionId: state.sessionId,
    player: state.player,
    score: { base: state.score.base, speedBonus: state.score.speedBonus, total: state.score.total },
    meta: {
      totalQuestions: state.questions.length,
      correctCount,
      accuracy: Math.round((correctCount/state.questions.length)*100),
      timeSpentSec: state.totalElapsedSec,
      userAgent: navigator.userAgent
    },
    answers: state.answers
  };

  try {
    // Dùng 'text/plain' + 'no-cors' để tránh preflight; phản hồi sẽ không đọc được
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    $("#sendStatus").textContent = "Đã gửi yêu cầu. Mở Google Trang tính để kiểm tra dữ liệu.";
  } catch (err) {
    console.error(err);
    $("#sendStatus").textContent = "Gửi thất bại. Hãy kiểm tra cấu hình hoặc mạng.";
  }
}

// Cho phép tải kết quả về máy (phòng trường hợp không gửi được)
function downloadResult() {
  const data = {
    sessionId: state.sessionId,
    player: state.player,
    score: { base: state.score.base, speedBonus: state.score.speedBonus, total: state.score.total },
    answers: state.answers,
    startedAt: new Date(state.startedAt).toISOString(),
    finishedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quiz-thu-vien-so_${state.sessionId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
