const translations = {
  en: {
    select_difficulty: "Select Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    submit: "Submit",
    time_left: "Time Left",
    time_up: "⏰ Time's up!",
    quiz_completed: "🎉 Quiz Completed!",
    your_score: "Your score",
    high_score: "🏆 High Score",
    restart: "Restart"
  },
  es: {
    select_difficulty: "Selecciona Dificultad",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    submit: "Enviar",
    time_left: "Tiempo restante",
    time_up: "⏰ ¡Tiempo terminado!",
    quiz_completed: "🎉 ¡Cuestionario completado!",
    your_score: "Tu puntuación",
    high_score: "🏆 Mejor puntuación",
    restart: "Reiniciar"
  }
};

const questions = {
  en: {
    easy: [
      { question: "What is 2 + 2?", a: "3", b: "4", c: "5", d: "6", correct: "b" },
      { question: "What color is the sky on a clear day?", a: "Red", b: "Green", c: "Blue", d: "Yellow", correct: "c" }
    ],
    medium: [
      { question: "Which language runs in the browser?", a: "Java", b: "C++", c: "JavaScript", d: "Python", correct: "c" },
      { question: "What does HTML stand for?", a: "Hyper Trainer Marking Language", b: "Hyper Text Markup Language", c: "Hyper Text Marketing Language", d: "Hyper Transfer Markup Language", correct: "b" }
    ],
    hard: [
      { question: "What is the time complexity of binary search?", a: "O(n)", b: "O(log n)", c: "O(n log n)", d: "O(1)", correct: "b" },
      { question: "What year was JavaScript released?", a: "1996", b: "1995", c: "1994", d: "1997", correct: "b" }
    ]
  },
  es: {
    easy: [
      { question: "¿Cuánto es 2 + 2?", a: "3", b: "4", c: "5", d: "6", correct: "b" },
      { question: "¿De qué color es el cielo en un día despejado?", a: "Rojo", b: "Verde", c: "Azul", d: "Amarillo", correct: "c" }
    ],
    medium: [
      { question: "¿Qué lenguaje se ejecuta en el navegador?", a: "Java", b: "C++", c: "JavaScript", d: "Python", correct: "c" },
      { question: "¿Qué significa HTML?", a: "Lenguaje de Marcado de Entrenamiento", b: "Lenguaje de Marcado de Hipertexto", c: "Lenguaje de Marketing de Hipertexto", d: "Lenguaje de Transferencia de Hipertexto", correct: "b" }
    ],
    hard: [
      { question: "¿Cuál es la complejidad temporal de búsqueda binaria?", a: "O(n)", b: "O(log n)", c: "O(n log n)", d: "O(1)", correct: "b" },
      { question: "¿En qué año se lanzó JavaScript?", a: "1996", b: "1995", c: "1994", d: "1997", correct: "b" }
    ]
  }
};

const languageSelector = document.getElementById('language');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const answerEls = document.querySelectorAll('.answer');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const resultEl = document.getElementById('result');
const timerEl = document.getElementById('timer');

let quizData = [];
let currentQuiz = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let selectedLevel = 'easy';
let currentLang = 'en';

// Localization updater
function updateLocalization() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

languageSelector.addEventListener('change', () => {
  currentLang = languageSelector.value;
  updateLocalization();
});

document.querySelectorAll('.level-btn').forEach(button => {
  button.addEventListener('click', () => {
    selectedLevel = button.dataset.level;
    quizData = [...questions[currentLang][selectedLevel]];
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    updateLocalization();
    loadQuiz();
    startTimer();
  });
});

function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];

  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function getSelected() {
  let answer;
  answerEls.forEach(el => {
    if (el.checked) {
      answer = el.id;
    }
  });
  return answer;
}

function deselectAnswers() {
  answerEls.forEach(el => el.checked = false);
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      endQuiz(translations[currentLang].time_up);
    } else {
      timerEl.innerText = `${translations[currentLang].time_left}: ${timeLeft}s`;
      timeLeft--;
    }
  }, 1000);
}

function endQuiz(message) {
  clearInterval(timerInterval);

  const highScoreKey = `highscore_${selectedLevel}_${currentLang}`;
  const previousHighScore = localStorage.getItem(highScoreKey) || 0;

  if (score > previousHighScore) {
    localStorage.setItem(highScoreKey, score);
  }

  const updatedHighScore = localStorage.getItem(highScoreKey);

  resultEl.innerHTML = `
    <h3>${message}</h3>
    <p>${translations[currentLang].your_score}: ${score} / ${quizData.length}</p>
    <p>${translations[currentLang].high_score} (${selectedLevel.toUpperCase()}): ${updatedHighScore} / ${quizData.length}</p>
    <button onclick="location.reload()">${translations[currentLang].restart}</button>
  `;

  submitBtn.style.display = 'none';
}

submitBtn.addEventListener('click', () => {
  const answer = getSelected();
  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }
    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      endQuiz(translations[currentLang].quiz_completed);
    }
  } else {
    alert("Please select an answer before submitting!");
  }
});

// Init on load
updateLocalization();
