const questions = {
  easy: [
    {
      question: "What is 2 + 2?",
      a: "3",
      b: "4",
      c: "5",
      d: "6",
      correct: "b"
    },
    {
      question: "What color is the sky on a clear day?",
      a: "Red",
      b: "Green",
      c: "Blue",
      d: "Yellow",
      correct: "c"
    }
  ],
  medium: [
    {
      question: "Which language runs in the browser?",
      a: "Java",
      b: "C++",
      c: "JavaScript",
      d: "Python",
      correct: "c"
    },
    {
      question: "What does HTML stand for?",
      a: "Hyper Trainer Marking Language",
      b: "Hyper Text Markup Language",
      c: "Hyper Text Marketing Language",
      d: "Hyper Transfer Markup Language",
      correct: "b"
    }
  ],
  hard: [
    {
      question: "What is the time complexity of binary search?",
      a: "O(n)",
      b: "O(log n)",
      c: "O(n log n)",
      d: "O(1)",
      correct: "b"
    },
    {
      question: "What year was JavaScript released?",
      a: "1996",
      b: "1995",
      c: "1994",
      d: "1997",
      correct: "b"
    }
  ]
};

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
let timeLeft = 60; // total quiz time
let timerInterval;

// Difficulty buttons
document.querySelectorAll('.level-btn').forEach(button => {
  button.addEventListener('click', () => {
    const level = button.dataset.level;
    quizData = [...questions[level]];
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
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

function endQuiz(message = "⏰ Time's up!") {
  resultEl.innerHTML = `
    <h3>${message}</h3>
    <p>Your score: ${score} / ${quizData.length}</p>
    <button onclick="location.reload()">Restart</button>
  `;
  submitBtn.style.display = 'none';
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      endQuiz("⏰ Time's up!");
    } else {
      timerEl.innerText = `Time Left: ${timeLeft}s`;
      timeLeft--;
    }
  }, 1000);
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
      endQuiz("🎉 Quiz Completed!");
    }
  } else {
    alert("Please select an answer before submitting!");
  }
});
