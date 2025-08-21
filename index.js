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

document.querySelectorAll('.level-btn').forEach(button => {
  button.addEventListener('click', () => {
    selectedLevel = button.dataset.level;
    startScreen.style.display = 'none';
    fetchQuestions(selectedLevel);
  });
});

function fetchQuestions(level) {
  const url = `https://opentdb.com/api.php?amount=5&difficulty=${level}&type=multiple`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      quizData = data.results.map(q => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        return {
          question: decodeHTML(q.question),
          a: decodeHTML(answers[0]),
          b: decodeHTML(answers[1]),
          c: decodeHTML(answers[2]),
          d: decodeHTML(answers[3]),
          correct: decodeHTML(q.correct_answer)
        };
      });
      quizContainer.style.display = 'block';
      loadQuiz();
      startTimer();
    })
    .catch(err => {
      console.error('Failed to fetch questions:', err);
      resultEl.innerHTML = `<p>Failed to load questions. Please try again.</p>`;
      startScreen.style.display = 'block';
    });
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function loadQuiz() {
  deselectAnswers();
  const current = quizData[currentQuiz];
  questionEl.innerText = current.question;
  [a_text, b_text, c_text, d_text].forEach((el, idx) => el.innerText = current[['a','b','c','d'][idx]]);
}

function getSelected() {
  return Array.from(answerEls).find(el => el.checked)?.nextSibling.textContent;
}

function deselectAnswers() {
  answerEls.forEach(el => el.checked = false);
}

function startTimer() {
  timerEl.innerText = `Time Left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    if (--timeLeft < 0) {
      endQuiz("Time's up!");
    } else {
      timerEl.innerText = `Time Left: ${timeLeft}s`;
    }
  }, 1000);
}

function endQuiz(msg) {
  clearInterval(timerInterval);
  resultEl.innerHTML = `
    <h3>${msg}</h3>
    <p>Your score: ${score} / ${quizData.length}</p>
    <button onclick="location.reload()">Restart</button>`;
  submitBtn.style.display = 'none';
}

submitBtn.addEventListener('click', () => {
  const selected = getSelected();
  if (selected) {
    if (selected === quizData[currentQuiz].correct) score++;
    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      endQuiz("Quiz Completed!");
    }
  } else {
    alert("Please select an answer before submitting!");
  }
});
