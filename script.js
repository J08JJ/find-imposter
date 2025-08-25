let currentStage = 0;
let lives = 3;
let canProceed = false;

const stageTitle = document.createElement("div");
stageTitle.id = "stage-title";
const livesDiv = document.createElement("div");
livesDiv.id = "lives";
livesDiv.textContent = "❤️❤️❤️";

const gameHeader = document.createElement("div");
gameHeader.id = "game-header";
gameHeader.appendChild(stageTitle);
gameHeader.appendChild(livesDiv);

document.body.insertBefore(gameHeader, document.getElementById("stages"));

const caseInfo = document.createElement("div");
caseInfo.id = "case-info";
document.body.insertBefore(caseInfo, document.getElementById("stages"));

const content = document.createElement("div");
content.id = "content";
content.innerHTML = `
  <div id="evidence">
    <h3>증거 자료</h3>
    <ul id="evidence-list"></ul>
    <div id="evidence-info"></div>
  </div>
  <div id="suspects"></div>
`;
document.body.insertBefore(content, document.getElementById("stages"));

const nextStageBtn = document.createElement("button");
nextStageBtn.id = "next-stage";
nextStageBtn.disabled = true;
nextStageBtn.textContent = "다음 스테이지";
document.body.appendChild(nextStageBtn);

const restartBtn = document.createElement("button");
restartBtn.id = "restart-game";
restartBtn.textContent = "게임 다시 시작";
restartBtn.style.display = "none";
document.body.appendChild(restartBtn);

const modal = document.createElement("div");
modal.id = "modal";
modal.innerHTML = `<div id="modal-content"></div>`;
document.body.appendChild(modal);

const modalContent = document.getElementById("modal-content");
const stages = document.querySelectorAll(".stage");

function renderStage() {
  canProceed = false;
  nextStageBtn.disabled = true;
  const stage = stages[currentStage];
  stageTitle.textContent = stage.dataset.title;
  caseInfo.innerHTML = `
    <b>발생시간:</b> ${stage.dataset.time}<br>
    <b>장소:</b> ${stage.dataset.place}<br>
    <b>${stage.querySelector(".victim").dataset.name}</b>
  `;

  const evidenceList = document.getElementById("evidence-list");
  const evidenceInfoDiv = document.getElementById("evidence-info");
  evidenceList.innerHTML = "";
  stage.querySelectorAll(".evidences li").forEach(ev => {
    const li = document.createElement("li");
    li.textContent = ev.dataset.title;
    li.addEventListener("click", () => {
      evidenceInfoDiv.style.display = "block";
      evidenceInfoDiv.textContent = ev.dataset.info;
    });
    evidenceList.appendChild(li);
  });

  const suspectsDiv = document.getElementById("suspects");
  suspectsDiv.innerHTML = "";
  stage.querySelectorAll(".suspect").forEach(s => {
    const div = document.createElement("div");
    div.className = "suspect";
    div.innerHTML = `
      <div class="suspect-header">
        <span><b>${s.dataset.name}</b></span>
        <button class="info-btn">정보</button>
      </div>
      <button class="accuse-btn">범인 지목</button>
    `;
    div.querySelector(".info-btn").addEventListener("click", () => {
      showModal(
        `이름: ${s.dataset.name}\n나이: ${s.dataset.age}\n성별: ${s.dataset.gender}\n직업: ${s.dataset.job}\n\n진술: ${s.dataset.statement}\n행동: ${s.dataset.action}`
      );
    });
    div.querySelector(".accuse-btn").addEventListener("click", () => {
      showAccuseModal(s.dataset.name, stage.querySelector(".culprit").dataset.name);
    });
    suspectsDiv.appendChild(div);
  });
}

function showModal(message) {
  modalContent.innerHTML = `<p style="white-space:pre-line; text-align:left;">${message}</p>
    <div class="modal-btns"><button id="close-modal">닫기</button></div>`;
  modal.style.display = "flex";
  document.getElementById("close-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

function showAccuseModal(name, culprit) {
  modalContent.innerHTML = `
    <p>정말 ${name}을(를) 지목하시겠습니까?</p>
    <div class="modal-btns">
      <button id="yes-btn">예</button>
      <button id="no-btn">아니오</button>
    </div>`;
  modal.style.display = "flex";
  document.getElementById("yes-btn").addEventListener("click", () => {
    modal.style.display = "none";
    if (name === culprit) {
      canProceed = true;
      nextStageBtn.disabled = false;
      showModal(`정답! ${name}이(가) 범인입니다.\n'다음 스테이지' 버튼을 눌러 진행하세요.`);
    } else {
      lives--;
      updateLives();
      showModal(`오답입니다! (${name}은 범인이 아닙니다)`);
    }
  });
  document.getElementById("no-btn").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

function updateLives() {
  livesDiv.textContent = "❤️".repeat(lives);
  if (lives <= 0) {
    alert("수명이 모두 소진되었습니다. 게임 종료");
    restartBtn.style.display = "block";
    nextStageBtn.disabled = true;
  }
}

nextStageBtn.addEventListener("click", () => {
  if (!canProceed) return;
  currentStage++;
  if (currentStage >= stages.length) {
    alert("모든 스테이지 완료 게임 종료.");
    restartBtn.style.display = "block";
    nextStageBtn.style.display = "none";
  } else {
    renderStage();
  }
});

restartBtn.addEventListener("click", () => {
  currentStage = 0;
  lives = 3;
  livesDiv.textContent = "❤️❤️❤️";
  restartBtn.style.display = "none";
  nextStageBtn.style.display = "block";
  renderStage();
});

renderStage();