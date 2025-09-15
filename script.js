/* ============================================
   script.js — Full quiz logic (8 questions)
   Includes: Start, Next, Ad panel, See Result,
   Play Again (Restart), Share, keyboard support.
   ============================================ */

/* Elements (must match index.html) */
const startBtn = document.getElementById('start-btn');
const introPanel = document.getElementById('intro');
const quizPanel = document.getElementById('quiz-panel');
const adPanel = document.getElementById('ad-panel');
const resultPanel = document.getElementById('result-panel');

const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

const questionTitle = document.getElementById('question-title');
const answersEl = document.getElementById('answers');

const nextBtn = document.getElementById('next-btn');
const seeResultBtn = document.getElementById('see-result-btn');

const actorNameEl = document.getElementById('actor-name');
const actorImageEl = document.getElementById('actor-image');
const actorDescEl = document.getElementById('actor-desc');

const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');

/* ---------- Internal state ---------- */
let currentQuestionIndex = 0;
let selectedAnswers = []; // stores chosen index for each question
let scores = {}; // actor -> number
let totalQuestions = 8;

/* ---------- Questions (exactly 8) ---------- */
const questions = [
  {
    text: "Which movie genre do you enjoy the most?",
    answers: [
      { label: "Action & stunts", actor: "Tom Cruise" },
      { label: "Heavy drama", actor: "Leonardo DiCaprio" },
      { label: "Romantic stories", actor: "Ryan Gosling" },
      { label: "Quirky fantasy", actor: "Johnny Depp" }
    ]
  },
  {
    text: "How would your friends describe your personality?",
    answers: [
      { label: "Confident & bold", actor: "Brad Pitt" },
      { label: "Calm & thoughtful", actor: "Keanu Reeves" },
      { label: "Witty & sharp", actor: "Robert Downey Jr." },
      { label: "Warm & wise", actor: "Morgan Freeman" }
    ]
  },
  {
    text: "Pick a dream vacation:",
    answers: [
      { label: "Island & surf", actor: "Chris Hemsworth" },
      { label: "Cultural city break", actor: "Leonardo DiCaprio" },
      { label: "Adrenaline trip", actor: "Tom Cruise" },
      { label: "Cozy mountain retreat", actor: "Morgan Freeman" }
    ]
  },
  {
    text: "What hobby fits you best?",
    answers: [
      { label: "Working out", actor: "Dwayne Johnson" },
      { label: "Music & art", actor: "Johnny Depp" },
      { label: "Film & acting", actor: "Brad Pitt" },
      { label: "Reading & reflection", actor: "Keanu Reeves" }
    ]
  },
  {
    text: "Choose a favorite drink:",
    answers: [
      { label: "Bold whiskey", actor: "Leonardo DiCaprio" },
      { label: "Espresso", actor: "Robert Downey Jr." },
      { label: "Protein shake", actor: "Dwayne Johnson" },
      { label: "Red wine", actor: "Brad Pitt" }
    ]
  },
  {
    text: "Which trait matters most to you?",
    answers: [
      { label: "Kindness", actor: "Keanu Reeves" },
      { label: "Courage", actor: "Tom Cruise" },
      { label: "Creativity", actor: "Johnny Depp" },
      { label: "Wisdom", actor: "Morgan Freeman" }
    ]
  },
  {
    text: "Which word fits you best?",
    answers: [
      { label: "Fearless", actor: "Tom Cruise" },
      { label: "Playful", actor: "Ryan Gosling" },
      { label: "Reliable", actor: "Dwayne Johnson" },
      { label: "Mysterious", actor: "Johnny Depp" }
    ]
  },
  {
    text: "Your dream role would be:",
    answers: [
      { label: "Superhero", actor: "Robert Downey Jr." },
      { label: "Epic romantic lead", actor: "Ryan Gosling" },
      { label: "Legendary mentor", actor: "Morgan Freeman" },
      { label: "Action lead", actor: "Dwayne Johnson" }
    ]
  }
];

/* ---------- Actors data (name, image, description) ---------- */
const actors = {
  "Brad Pitt": {
    image: "https://cdn.britannica.com/57/262757-050-C31FBA0D/actor-brad-pitt-attends-the-81st-venice-international-film-festival-palazzo-del-cinema-september-1-2024-venice-italy.jpg",
    desc: "Versatile and charismatic — you have classic Hollywood charm and a magnetic presence."
  },
  "Ryan Gosling": {
    image: "https://hips.hearstapps.com/hmg-prod/images/ryan-gosling-attends-the-96th-oscars-nominees-luncheon-at-news-photo-1710014412.jpg",
    desc: "Romantic and cool — you bring subtlety, emotion and smooth charm to everything you do."
  },
  "Robert Downey Jr.": {
    image: "https://images.hindustantimes.com/rf/image_size_640x362/HT/p1/2015/04/03/Incoming/Pictures/1333507_Wallpaper2.jpg",
    desc: "Witty, intelligent and charismatic — your humor and confidence light up every room."
  },
  "Leonardo DiCaprio": {
    image: "https://v.wpimg.pl/cmlvLmpwTAwNFDpeXwxBGU5MbgQZVU9PGVR2T18UTFxYRnwVQkZTXUMSYhoAHg4KQgYgQklDVFhaQX9aR1pOXFhBdVtJQlRdXFkgCB8ZAh8IGWEJGRQCHR4fI0MaBwRPEQ",
    desc: "Passionate and driven — you pursue excellence and bring depth to your work."
  },
  "Johnny Depp": {
    image: "https://i.guim.co.uk/img/media/d6c54e67b75214846385420e0106979b118fa006/0_0_1606_2229/master/1606.jpg",
    desc: "Creative and eccentric — you love to surprise, transform and perform from the heart."
  },
  "Tom Cruise": {
    image: "https://i.pinimg.com/736x/65/c1/75/65c175d8b0f1eaf953e0da7a1cb71234.jpg",
    desc: "Adventurous and fearless — you take risks and thrive in the center of action."
  },
  "Dwayne Johnson": {
    image: "https://www.indiewire.com/wp-content/uploads/2023/07/GettyImages-1531449044.jpg",
    desc: "Strong, warm and motivating — a natural leader with great energy."
  },
  "Chris Hemsworth": {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkcE0NyLFMQx4NxMu_l8nJwuqmwmbznOTkMg&s",
    desc: "Heroic and friendly — you balance power with a generous spirit."
  },
  "Keanu Reeves": {
    image: "https://cdn.theatlantic.com/thumbor/L5AH7qJ3V1aGL63LCNmzvxjEdP0=/0x0:2559x1439/1600x900/media/img/mt/2019/06/KRMT/original.jpg",
    desc: "Calm and kind — you have quiet strength and a humble presence."
  },
  "Morgan Freeman": {
    image: "https://www.gannett-cdn.com/-mm-/7cde49f8a45c6a4138f9b243f1c67ee2823cf3a4/c=0-199-3994-2455/local/-/media/2018/05/24/USATODAY/USATODAY/636628152390147058-GTY-943813288-99388261.JPG",
    desc: "Wise, grounded and iconic — your presence commands respect and attention."
  }
};

/* ---------- Utility helpers ---------- */
function showPanel(panelEl) {
  // hide all card panels then show requested
  const panels = document.querySelectorAll('.card > .panel');
  panels.forEach(p => p.classList.remove('active'));
  panelEl.classList.add('active');
}

function resetState() {
  selectedAnswers = [];
  scores = {};
  currentQuestionIndex = 0;
  progressFill.style.width = '0%';
  progressText.textContent = `Question 1 of ${questions.length}`;
}

/* ---------- Quiz flow ---------- */
function startQuiz() {
  resetState();
  showPanel(quizPanel);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) return;
  // title
  questionTitle.textContent = q.text;
  // answers
  answersEl.innerHTML = '';
  q.answers.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = `<span class="label">${ans.label}</span>`;
    btn.addEventListener('click', () => {
      selectAnswer(idx);
    });
    answersEl.appendChild(btn);
  });
  // update progress text & fill
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  const percent = Math.round((currentQuestionIndex / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
  nextBtn.disabled = true;
}

/* When user selects an answer */
function selectAnswer(answerIndex) {
  // set visual selection
  Array.from(answersEl.children).forEach((b, i) => b.classList.toggle('selected', i === answerIndex));
  // store selected index
  selectedAnswers[currentQuestionIndex] = answerIndex;
  nextBtn.disabled = false;
}

/* Next button handler */
function goNext() {
  // record score for chosen answer
  const selIdx = selectedAnswers[currentQuestionIndex];
  if (typeof selIdx === 'number') {
    const actor = questions[currentQuestionIndex].answers[selIdx].actor;
    if (!scores[actor]) scores[actor] = 0;
    scores[actor] += 1;
  }
  // move forward or show ad panel
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    // before result, show ad placeholder panel
    showPanel(adPanel);
    // set progress to full
    progressFill.style.width = '100%';
  }
}

/* Compute top actor and show final result */
function computeTopActor() {
  let top = null;
  let max = -1;
  for (const a in scores) {
    if (scores[a] > max) {
      max = scores[a];
      top = a;
    }
  }
  if (!top) {
    // if nothing selected (shouldn't happen), pick random actor
    const keys = Object.keys(actors);
    top = keys[Math.floor(Math.random() * keys.length)];
  }
  return top;
}

function showResult() {
  const topActor = computeTopActor();
  const data = actors[topActor];
  actorNameEl.textContent = topActor;
  actorImageEl.src = data.image;
  actorImageEl.alt = topActor;
  actorDescEl.textContent = data.desc;
  showPanel(resultPanel);
}

/* Restart (Play Again) */
function restartQuiz() {
  resetState();
  showPanel(introPanel);
  // clear images & texts
  actorNameEl.textContent = '';
  actorImageEl.src = '';
  actorImageEl.alt = '';
  actorDescEl.textContent = '';
}

/* Share result */
function shareResult() {
  const text = `I got ${actorNameEl.textContent} on this fun quiz! Which Actor Are You?`;
  if (navigator.share) {
    navigator.share({ title: 'Which Actor Are You?', text, url: location.href }).catch(()=>{});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(()=> alert('Result copied to clipboard.'));
  } else {
    prompt('Copy your result:', text);
  }
}

/* Keyboard support: 1-4 for answers, Enter for next */
document.addEventListener('keydown', (e) => {
  const activePanel = document.querySelector('.card > .panel.active');
  if (activePanel !== quizPanel) return;
  if (e.key >= '1' && e.key <= '4') {
    const idx = parseInt(e.key, 10) - 1;
    if (answersEl.children[idx]) answersEl.children[idx].click();
  } else if (e.key === 'Enter' && !nextBtn.disabled) {
    goNext();
  }
});

/* ---------- Event bindings ---------- */
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', goNext);
seeResultBtn.addEventListener('click', showResult);
restartBtn.addEventListener('click', restartQuiz);
shareBtn.addEventListener('click', shareResult);

/* Initialize */
(function init() {
  resetState();
  showPanel(introPanel);
})();
