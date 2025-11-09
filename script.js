/* script.js — 30 soal PK (formal UTBK), kunci & pembahasan sinkron */
/* Pastikan index.html memiliki canvas #resultChart dengan width/height tetap (seperti yang dikirim sebelumnya) */

const loginPage = document.getElementById('login-page');
const examPage = document.getElementById('exam-page');
const resultPage = document.getElementById('result-page');

const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const togglePwd = document.getElementById('togglePwd');
const eyeIcon = document.getElementById('eyeIcon');
const loginBtn = document.getElementById('loginBtn');

const qNumbers = document.getElementById('qNumbers');
const questionBox = document.getElementById('questionBox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');

const timerEl = document.getElementById('timer');

const resultChartEl = document.getElementById('resultChart');
const scoreSummary = document.getElementById('scoreSummary');
const scoreUTBK = document.getElementById('scoreUTBK');
const explanations = document.getElementById('explanations');
const finishBtn = document.getElementById('finishBtn');

let currentIndex = 0;
let userAnswers = [];
let timerInterval = null;
const durationSec = 30 * 60; // 60 menit
let chartInstance = null;

/* ================== 30 Soal (formal, simbol HTML) ================== */
/* tiap objek: q (boleh mengandung <sup>/<sub>/√), options[4], answer (index), explain (teks) */
const questions = [
  { q: '1. Jika 2<sup>(x+1)</sup> = 32, maka nilai x adalah ...', options: ['3','4','5','2'], answer: 1, explain: '2<sup>(x+1)</sup>=32=2<sup>5</sup> ⇒ x+1=5 ⇒ x=4.' },

  { q: '2. Nilai dari <sup>3</sup>log81 adalah ...', options: ['3','4','2','5'], answer: 1, explain: '81 = 3<sup>4</sup> ⇒ log<sub>3</sub>81 = 4.' },

  { q: '3. Barisan aritmetika: 7, 10, 13, … . Suku ke-20 adalah ...', options: ['64','67','70','73'], answer: 0, explain: 'a<sub>n</sub>=7+(n−1)·3 ⇒ a<sub>20</sub>=7+19·3=64.' },

  { q: '4. Diketahui P(x) = x³ − x² − x + 1. Nilai P(1) adalah ...', options: ['0','1','−1','2'], answer: 0, explain: 'P(1)=1−1−1+1=0.' },

  { q: '5. Hitung (√50 + √2) − (√50 − √2)=', options: ['2√2','2√50','√2','2'], answer: 0, explain: 'Ekspresi = 2√2.' },

  { q: '6. Jika 1/a + 1/b = 1/6 dan a = 12, maka nilai b adalah ...', options: ['12','8','24','6'], answer: 0, explain: '1/12 + 1/b = 1/6 ⇒ 1/b = 1/12 ⇒ b = 12.' },

  { q: '7. Nilai dari 5! ÷ 3! adalah ...', options: ['20','10','15','30'], answer: 0, explain: '5!=120, 3!=6 ⇒ 120 ÷ 6 = 20.' },

  { q: '8. Jika sin θ = 3/5 dan 0° < θ < 90°, maka cos θ = ...', options: ['4/5','3/4','1/2','√(16)/5'], answer: 0, explain: 'cos = √(1 − (3/5)²) = √(16/25) = 4/5.' },

  { q: '9. Perbandingan umur A : B = 5 : 7. Jika A + B = 144, umur A adalah ...', options: ['60','62','64','65'], answer: 0, explain: 'Total rasio = 12 ⇒ tiap bagian = 12 ⇒ A = 5·12 = 60.' },

  { q: '10. Dua buah dadu dilempar bersamaan satu kali. Peluang jumlah mata dadu sama dengan 7 adalah ...', options: ['1/6','1/9','1/12','1/3'], answer: 0, explain: 'Kombinasi yang menghasilkan 7 ada 6 dari 36 → 1/6.' },

  { q: '11. Dalam segitiga siku-siku dengan sisi siku-siku 6 dan 8, sisi miring adalah ...', options: ['10','12','14','20'], answer: 0, explain: 'Sisi miring = √(6² + 8²) = √100 = 10.' },

  { q: '12. Jika 3x − 7 = 2x + 5, maka x = ...', options: ['10','−12','12','−10'], answer: 2, explain: '3x − 2x = 5 + 7 ⇒ x = 12.' },

  { q: '13. Jika 4<sup>(2x)</sup> = 64, maka nilai x adalah ...', options: ['3/2','2','5/2','3'], answer: 0, explain: '4<sup>2x</sup>=(2²)<sup>2x</sup>=2<sup>4x</sup>; 64=2<sup>6</sup> ⇒ 4x=6 ⇒ x=3/2.' },

  { q: '14. Hitung jumlah 3 + 6 + 12 + 24 + 48.', options: ['93','96','99','150'], answer: 0, explain: 'Deret geometri a=3 r=2, n=5 ⇒ S = 3(2⁵ − 1) = 3·31 = 93.' },

  { q: '15. Faktorisasi dari x² − 5x + 6 adalah ...', options: ['(x−2)(x−3)','(x+2)(x−3)','(x−1)(x−6)','(x+2)(x+3)'], answer: 0, explain: 'x² − 5x + 6 = (x−2)(x−3).' },

  { q: '16. Jika P(A) = 0.4, P(B) = 0.5 dan A ∩ B = ∅, maka P(A ∪ B) = ...', options: ['0.1','0.9','0.2','0.4'], answer: 1, explain: 'P(A ∪ B) = P(A)+P(B) = 0.4+0.5 = 0.9.' },

  { q: '17. Persamaan 1/x + 1/(x+1) = 1; apakah terdapat bilangan bulat positif x yang memenuhi?', options: ['1','2','3','Tidak ada'], answer: 3, explain: 'Menyelesaikan menghasilkan akar non-integer → tidak ada bilangan bulat positif.' },

  { q: '18. Diberikan f(x) = 2x + 3. Nilai f(f(1)) adalah ...', options: ['7','11','13','17'], answer: 2, explain: 'f(1)=5 → f(5)=2·5+3=13.' },

  { q: '19. Jika x + y = 7 dan x − y = 1, maka nilai x adalah ...', options: ['4','3','5','2'], answer: 0, explain: 'Menjumlahkan kedua persamaan: 2x = 8 ⇒ x = 4.' },

  { q: '20. Nilai kombinasi C(5,2) adalah ...', options: ['5','10','20','15'], answer: 1, explain: 'C(5,2) = 5·4 / 2 = 10.' },

  { q: '21. Nilai dari log<sub>10</sub>1000 adalah ...', options: ['2','3','4','1'], answer: 1, explain: '10³ = 1000 ⇒ log<sub>10</sub>1000 = 3.' },

  { q: '22. Suhu naik dari 10°C menjadi 25°C. Kenaikan suhu adalah ...', options: ['10°C','12°C','15°C','20°C'], answer: 2, explain: '25 − 10 = 15°C.' },

  { q: '23. Dalam sebuah kotak terdapat 3 bola merah dan 5 bola putih. Jika diambil satu bola acak, peluang terambil bola putih adalah ...', options: ['3/8','5/8','1/2','5/3'], answer: 1, explain: 'Jumlah bola = 8; putih = 5 ⇒ P = 5/8.' },

  { q: '24. Deret 2, 5, 11, 23, ...; suku berikutnya adalah ...', options: ['35','47','45','46'], answer: 1, explain: 'Pola: tiap suku ≈ 2·suku sebelumnya + 1 ⇒ 23·2 + 1 = 47.' },

  { q: '25. Diketahui luas lingkaran πr² = 154 dengan π = 22/7. Nilai r adalah ...', options: ['7','6','14','11'], answer: 0, explain: '154 = (22/7)·r² ⇒ r² = 49 ⇒ r = 7.' },

  { q: '26. Jika suatu besaran dikurangi 20% dari nilainya, hasilnya dari 50 adalah ...', options: ['30','35','40','45'], answer: 2, explain: '20%×50 = 10 ⇒ 50 − 10 = 40.' },

  { q: '27. Jika 3x = 2y dan y = 12, maka nilai x adalah ...', options: ['6','8','9','12'], answer: 1, explain: '3x = 2·12 = 24 ⇒ x = 24/3 = 8.' },

  { q: '28. Jika panjang sisi kubus adalah 4 cm, luas seluruh permukaan kubus adalah ...', options: ['64 cm²','96 cm²','48 cm²','24 cm²'], answer: 1, explain: 'Luas permukaan = 6·s² = 6·16 = 96 cm².' },

  { q: '29. Jika 2x² = 18, nilai x (positif) adalah ...', options: ['3','9','7','4'], answer: 0, explain: '2x² = 18 ⇒ x² = 9 ⇒ x positif = 3.' },

  { q: '30. Jika probabilitas suatu peristiwa terjadi pada satu percobaan adalah 0.2 (independen), maka peluang peristiwa tidak terjadi pada 3 percobaan berturut-turut adalah ...', options: ['0.8³','3·0.8','0.2³','1 − 0.8³'], answer: 0, explain: 'P(tidak terjadi tiap percobaan) = 0.8 ⇒ P = 0.8³.' }
];

/* ================ Helpers & UI ================ */

userAnswers = new Array(questions.length).fill(null);

function showPage(pageEl){
  [loginPage, examPage, resultPage].forEach(p => p.classList.remove('active'));
  pageEl.classList.add('active');
}

function renderQNumbers(){
  qNumbers.innerHTML = '';
  questions.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.textContent = i + 1;
    btn.className = 'num-btn';
    if (i === currentIndex) btn.classList.add('active');
    if (userAnswers[i] !== null) btn.classList.add('answered');
    btn.onclick = () => { saveAnswer(); currentIndex = i; renderQuestion(); };
    qNumbers.appendChild(btn);
  });
}

function renderQuestion(){
  renderQNumbers();
  const q = questions[currentIndex];
  // allow HTML tags in question (sup/sub)
  questionBox.innerHTML = `
    <div class="question">${q.q}</div>
    <div class="options">
      ${q.options.map((opt, idx) => `
        <label class="option">
          <input type="radio" name="opt" value="${idx}" ${userAnswers[currentIndex] === idx ? 'checked' : ''}>
          ${String.fromCharCode(65 + idx)}. ${opt}
        </label>
      `).join('')}
    </div>
  `;
  document.querySelectorAll('input[name="opt"]').forEach(r => {
    r.onchange = () => {
      userAnswers[currentIndex] = parseInt(document.querySelector('input[name="opt"]:checked').value, 10);
      renderQNumbers();
    };
  });
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === questions.length - 1;
}

function saveAnswer(){
  const sel = document.querySelector('input[name="opt"]:checked');
  if (sel) userAnswers[currentIndex] = parseInt(sel.value, 10);
}

/* ================ Timer ================ */
function startTimer(){
  if (timerInterval) clearInterval(timerInterval);
  const end = Date.now() + durationSec * 1000;
  timerInterval = setInterval(() => {
    const rem = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const mm = String(Math.floor(rem / 60)).padStart(2, '0');
    const ss = String(rem % 60).padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}`;
    if (rem <= 0) {
      clearInterval(timerInterval);
      finishExam();
    }
  }, 1000);
}

/* ================ Login & toggle password ================ */
let pwdVisible = false;
togglePwd.addEventListener('click', () => {
  pwdVisible = !pwdVisible;
  passwordInput.type = pwdVisible ? 'text' : 'password';
  eyeIcon.innerHTML = pwdVisible
    ? '<path d="M1 1L23 23"/><path d="M12 4C4 4 2 12 2 12s2 8 10 8 10-8 10-8-2-8-10-8z"/>'
    : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>';
});

loginBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const pass = passwordInput.value.trim();
  if (!name) { alert('Masukkan nama!'); return; }
  if (pass !== 'admin') { alert('Password salah! Gunakan "admin".'); return; }
  currentIndex = 0;
  userAnswers.fill(null);
  renderQuestion();
  showPage(examPage);
  startTimer();
});

/* ================ Navigation ================ */
prevBtn.addEventListener('click', () => { saveAnswer(); if (currentIndex > 0) currentIndex--; renderQuestion(); });
nextBtn.addEventListener('click', () => { saveAnswer(); if (currentIndex < questions.length - 1) currentIndex++; renderQuestion(); });

submitBtn.addEventListener('click', () => {
  if (confirm('Yakin ingin mengumpulkan jawaban?')) finishExam();
});

/* ================ Finish & Result ================ */
function finishExam(){
  saveAnswer();
  if (timerInterval) clearInterval(timerInterval);

  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) correct++;
  }
  const wrong = questions.length - correct;
  const score = Math.round((correct / questions.length) * 1000);

  // destroy previous chart
  if (chartInstance) { try { chartInstance.destroy(); } catch (e) {} chartInstance = null; }

  // draw chart using canvas exact size to avoid zoom
  const ctx = resultChartEl.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Benar', 'Salah'],
      datasets: [{ data: [correct, wrong], backgroundColor: ['#2e7d32', '#c62828'], borderWidth: 2 }]
    },
    options: {
      responsive: false,       // use canvas width/height exactly (prevents zoom/scale artifacts)
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  scoreSummary.textContent = `Benar: ${correct} | Salah: ${wrong} | Total: ${questions.length}`;
  scoreUTBK.textContent = `Perkiraan Skor UTBK: ${score}`;

  // pembahasan
  explanations.innerHTML = questions.map((q, i) => {
    const ua = userAnswers[i];
    const right = ua === q.answer;
    return `<div class="exp">
      <b>Soal ${i+1}.</b> ${q.q}
      <p>Jawaban Anda: <strong>${ua !== null ? (String.fromCharCode(65+ua) + '. ' + q.options[ua]) : '<em>Tidak dijawab</em>'}</strong> — ${right ? '<span class="correct">Benar ✓</span>' : '<span class="wrong">Salah ✗</span>'}</p>
      ${!right ? `<p>Jawaban benar: <strong>${String.fromCharCode(65+q.answer)}. ${q.options[q.answer]}</strong></p>` : ''}
      <p><em>Pembahasan:</em> ${q.explain}</p>
    </div>`;
  }).join('');

  showPage(resultPage);
}

/* ================ Finish button (reset) ================ */
finishBtn.addEventListener('click', () => {
  if (chartInstance) { try { chartInstance.destroy(); } catch (e) {} chartInstance = null; }
  nameInput.value = '';
  passwordInput.value = '';
  timerEl.textContent = (() => {
    const m = String(Math.floor(durationSec / 60)).padStart(2, '0');
    const s = String(durationSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  })();
  userAnswers = new Array(questions.length).fill(null);
  currentIndex = 0;
  showPage(loginPage);
});

/* ================ Initial setup ================ */
renderQNumbers();
timerEl.textContent = (() => {
  const m = String(Math.floor(durationSec / 60)).padStart(2, '0');
  const s = String(durationSec % 60).padStart(2, '0');
  return `${m}:${s}`;
})();
