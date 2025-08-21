const quizData = [
  {
    question: "What is the capital of France?",
    a: "Berlin",
    b: "Madrid",
    c: "Paris",
    d: "Rome",
    correct: "c"
  },
  {
    question: "Which language runs in a web browser?",
    a: "Java",
    b: "C",
    c: "Python",
    d: "JavaScript",
    correct: "d"
  },
  {
    question: "What does CSS stand for?",
    a: "Central Style Sheets",
    b: "Cascading Style Sheets",
    c: "Cascading Simple Sheets",
    d: "Cars SUVs Sailboats",
    correct: "b"
  },
  {
    question: "What year was JavaScript launched?",
    a: "1996",
    b: "1995",
    c: "1994",
    d: "None of the above",
    correct: "b"
  }
];

const questionEl = document.getElementById('question');
const answerEls = document.querySelectorAll('.answer');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const resultEl = document.getElementById('result');

let currentQuiz = 0;
let score = 0;

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
      resultEl.innerHTML = `
        <h3>You answered ${score}/${quizData.length} questions correctly</h3>
        <button onclick="location.reload()">Reload Quiz</button>
      `;
      submitBtn.style.display = 'none';
    }
  } else {
    alert("Please select an answer before submitting!");
  }
});

loadQuiz();
