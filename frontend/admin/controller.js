/* eslint-env browser */

const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("questionsLoaded", (_, data) => {
  const nbLoaded = document.querySelector(".ip--nbLoaded");
  nbLoaded.innerHTML = data;
});

ipcRenderer.on("questionUpdated", (_, data) => {
  const question = document.querySelector(".ip--question");
  const id = document.querySelector(".ip--id");
  const answer = document.querySelector(".ip--answer");
  const category = document.querySelector(".ip--category");
  question.innerHTML = data.question;
  id.innerHTML = data.id;
  answer.innerHTML = data.answer;
  category.innerHTML = data.category;
});

ipcRenderer.on("time", (_, data) => {
  const timer = document.querySelector(".ip--timer");
  if (data === 0) return "0 secondes";

  const heures = Math.floor(data / 3600) % 24;
  data -= heures * 3600;

  const minutes = Math.floor(data / 60) % 60;
  data -= minutes * 60;

  const secondes = data % 60; // normalement pas utile le modulo mais bon
  let returnString = "";

  if (heures !== 0) returnString += `${heures} heure${heures > 1 ? "s" : ""} `;
  if (minutes !== 0)
    returnString += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  if (secondes !== 0)
    returnString += `${secondes} seconde${secondes > 1 ? "s" : ""} `;

  timer.innerHTML = returnString;
});

ipcRenderer.on("status", (_, data) => {
  document
    .querySelectorAll(".started, .paused, .stopped")
    .forEach(
      (e) => (e.style.display = e.classList.contains(data) ? "flex" : "none")
    );
});

const startButton = document.getElementById("start");
startButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:start");
});

const pauseButton = document.getElementById("pause");
pauseButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:pause");
});

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:stop");
});

const dlAgainButton = document.getElementById("dl-again");
dlAgainButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("gsheet:download");
});

const gotoLastButton = document.getElementById("goto-last");
gotoLastButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:gotoLast");
});

const previousButton = document.getElementById("previous");
previousButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:previous");
});

const nextButton = document.getElementById("next");
nextButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:next");
});

const revealButton = document.getElementById("reveal");
revealButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:reveal");
});

const textsButton = document.getElementById("texts");
textsButton.addEventListener("click", async () => {
  await ipcRenderer.invoke(
    "roulotte:texts",
    document.getElementById("title").value,
    document.getElementById("waiting").value
  );
});

window.addEventListener("keydown", async (e) => {
  switch (e.key) {
    case "ArrowLeft":
      await ipcRenderer.invoke("roulotte:previous");
      break;
    case "ArrowRight":
      await ipcRenderer.invoke("roulotte:next");
      break;
    case "ArrowUp":
    case "ArrowDown":
      await ipcRenderer.invoke("roulotte:reveal");
      break;
    default:
      break;
  }
});
