//GLOBAL VARIABLES
const imgPath = "./images/faltuniform/"
let currentQuestionArray = Array;
let currentQuestion = 1;
let militaryRanks;
let rankImage;
let currentScore = 0;

//HTML ELEMENTS
const quizEl = document.getElementById("quiz");
const titleEl = document.getElementById("title");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl1 = document.getElementById("feedback-1");
const feedbackEl2 = document.getElementById("feedback-2");
const questionCounterEl = document.getElementById("question-counter");
const currentQuestionEl = document.getElementById("current-question");
const totalQuestionsEl = document.getElementById("total-questions");
const navEl = document.getElementById("nav");

//UTILITIES
function shuffleFisherYates(array) 
{
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * i);
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

//START SCREEN
titleEl.textContent = "Frågesport: Militära grader (fältuniform)";
createBtn("start-btn", "visible", "Start");
const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", runQuiz);

//RUN QUIZ
async function runQuiz() {
  startBtn.classList.add("hidden");
  choicesEl.classList.remove("hidden");
  titleEl.classList.remove("hidden");
  questionCounterEl.classList.remove("hidden");

  titleEl.textContent = "Vilken grad är detta?";

  await populate();

  //Anteckningsbok!

  //CHECK ANSWER, SAVE SCORE AND GIVE USER FEEDBACK, SHOW BUTTON FOR NEXT QUESTION, LOOP

  const responseBtns = document.getElementsByClassName("choice-btn");

  for (let btn of responseBtns) {
    btn.addEventListener("click", function(){
      let answer = btn.textContent;
      if (answer == currentQuestionArray.ranks[currentQuestion -1].rankName) {
        currentScore++;
        feedbackEl1.textContent = "Rätt";
        feedbackEl1.className = "correct";
      } else {
        feedbackEl1.textContent = "Fel";
        feedbackEl1.className = "incorrect";
        feedbackEl2.textContent = "Rätt svar är " + currentQuestionArray.ranks[currentQuestion -1].rankName + ".";
      }

      console.log("Current score: " + currentScore);

      //inaktivera alla svarsknappar
      for (var i = 0; i < responseBtns.length; i++) {
        responseBtns[i].disabled = true;
      }
      
      //Visa Nästa-knappen
      nextBtn.disabled = false;
    });
  }
  
  //NEXT BUTTON
  createBtn("next-btn", "visible", "Nästa");
  const nextBtn = document.getElementById("next-btn");
  nextBtn.disabled = true;
  nextBtn.addEventListener("click", function() {
    for (var i = 0; i < responseBtns.length; i++) {
      responseBtns[i].disabled = false;
    }

    if (currentQuestion < currentQuestionArray.ranks.length) {
      currentQuestion++;
      currentQuestionEl.textContent = currentQuestion;
      rankImage.src = imgPath + militaryRanks["ranks"][currentQuestion - 1].image;
      feedbackEl1.textContent = "";
      feedbackEl2.textContent = "";
    } else if (currentQuestion == currentQuestionArray.ranks.length) {
      for (var i = 0; i < responseBtns.length; i++) {
        responseBtns[i].disabled = false;
      }
      feedbackEl1.textContent = "Dina poäng: ";
      feedbackEl2.textContent = currentScore + " av " + currentQuestionArray.ranks.length + " möjliga.";
      console.log("Final score: " + currentScore);
      questionCounterEl.classList = "hidden";
    }
    nextBtn.disabled = true;
  });

  //SAVE AND SHOW FINAL RESULT, PLUS PREVIOUS RESULTS
}

async function populate() 
{
  const request = new Request("./ranks.json");
  const response = await fetch(request);
  militaryRanks = await response.json();

  populateChoices(militaryRanks);
  shuffleFisherYates(militaryRanks.ranks);
  console.log("Shuffled list: ");
  console.log(militaryRanks.ranks);
  currentQuestionArray = militaryRanks;
  populateQuestion(currentQuestionArray);
  
  currentQuestionEl.textContent = currentQuestion;
  totalQuestionsEl.textContent = currentQuestionArray.ranks.length;
}

function populateQuestion(obj) 
{
  rankImage = document.createElement("img");
  rankImage.src = imgPath + obj["ranks"][currentQuestion - 1].image;
  questionEl.appendChild(rankImage);
}

function populateChoices(obj) 
{
  const ranks = obj.ranks;
  ranks.sort((a, b) => a.rankName.localeCompare(b.rankName))
  for (const rankName of ranks) {
    const choiceBtn = document.createElement("button");
    choiceBtn.classList = "choice-btn";
    choiceBtn.textContent = rankName.rankName;
    choicesEl.appendChild(choiceBtn);
  }
}

function createBtn(htmlId, htmlClass, text,) 
{
  const btn = document.createElement("button");
  btn.id = htmlId;
  btn.classList = htmlClass;
  btn.textContent = text;
  navEl.appendChild(btn);
}