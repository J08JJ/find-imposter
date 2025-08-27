var currentStage = 0;
var selectedSuspect = null;
var stages;

function startGame() {
    stages = document.querySelectorAll('.stage');
    makeGameUI();
    setupAllStages();
    showStage(0);
}

function makeGameUI() {
    var controlDiv = document.createElement('div');
    controlDiv.id = 'game-control';
    controlDiv.style.position = 'fixed';
    controlDiv.style.top = '20px';
    controlDiv.style.right = '20px';
    controlDiv.style.background = '#333';
    controlDiv.style.color = 'white';
    controlDiv.style.padding = '20px';
    controlDiv.style.borderRadius = '5px';
    controlDiv.style.zIndex = '1000';

    var stageInfo = document.createElement('div');
    stageInfo.innerHTML = '단계: <span id="current-stage">1</span> / ' + stages.length;

    var submitBtn = document.createElement('button');
    submitBtn.id = 'submit-answer';
    submitBtn.textContent = '범인 지목하기';
    submitBtn.onclick = function() { checkAnswer(); };

    var nextBtn = document.createElement('button');
    nextBtn.id = 'next-stage';
    nextBtn.textContent = '다음 단계';
    nextBtn.style.display = 'none';
    nextBtn.onclick = function() { goNextStage(); };

    var resetBtn = document.createElement('button');
    resetBtn.textContent = '게임 재시작';
    resetBtn.onclick = function() { restartGame(); };

    controlDiv.appendChild(stageInfo);
    controlDiv.appendChild(submitBtn);
    controlDiv.appendChild(nextBtn);
    controlDiv.appendChild(resetBtn);
    
    document.body.appendChild(controlDiv);

    var msgDiv = document.createElement('div');
    msgDiv.id = 'result-modal';
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '50%';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translate(-50%, -50%)';
    msgDiv.style.background = 'white';
    msgDiv.style.padding = '20px';
    msgDiv.style.border = '1px solid #ccc';
    msgDiv.style.zIndex = '2000';
    msgDiv.style.display = 'none';
    document.body.appendChild(msgDiv);
}

function setupAllStages() {
    for (var i = 0; i < stages.length; i++) {
        var stage = stages[i];
        stage.style.display = 'none';
        
        var titleDiv = document.createElement('div');
        titleDiv.innerHTML = '<h2>' + stage.dataset.title + '</h2><p>시간: ' + stage.dataset.time + ' | 장소: ' + stage.dataset.place + '</p>';
        stage.insertBefore(titleDiv, stage.firstChild);

        var victim = stage.querySelector('.victim');
        if (victim) {
            victim.innerHTML = '피해자: ' + victim.dataset.name + ' (' + victim.dataset.gender + ', ' + victim.dataset.age + ')';
        }

        var evidences = stage.querySelector('.evidences');
        if (evidences) {
            var evidenceTitle = document.createElement('h3');
            evidenceTitle.textContent = '증거 목록';
            evidences.insertBefore(evidenceTitle, evidences.firstChild);
            
            var evidenceList = evidences.querySelectorAll('li');
            for (var j = 0; j < evidenceList.length; j++) {
                var item = evidenceList[j];
                item.innerHTML = item.dataset.title + ': ' + item.dataset.info;
            }
        }

        setupSuspectsForStage(stage, i);
    }
}

function setupSuspectsForStage(stage, stageNum) {
    var suspectsDiv = stage.querySelector('.suspects');
    if (!suspectsDiv) return;

    var suspects = suspectsDiv.querySelectorAll('.suspect');
    for (var i = 0; i < suspects.length; i++) {
        var suspect = suspects[i];
        suspect.style.border = '1px solid #ccc';
        suspect.style.padding = '10px';
        suspect.style.margin = '5px';
        suspect.style.cursor = 'pointer';
        suspect.style.background = 'white';

        suspect.innerHTML = '<h4>' + suspect.dataset.name + '</h4>' +
                           '<p>' + suspect.dataset.gender + ', ' + suspect.dataset.age + ' | ' + suspect.dataset.job + '</p>' +
                           '<p>진술: "' + suspect.dataset.statement + '"</p>' +
                           '<p>행동: ' + suspect.dataset.action + '</p>';

        (function(suspectElement, suspectName, stage) {
            suspectElement.addEventListener('click', function() {
                chooseSuspect(suspectElement, suspectName, stage);
            });
        })(suspect, suspect.dataset.name, stageNum);
    }
}

function chooseSuspect(suspectDiv, name, stageNum) {
    if (stageNum != currentStage) return;

    var currentStageDiv = stages[currentStage];
    var allSuspects = currentStageDiv.querySelectorAll('.suspect');
    for (var i = 0; i < allSuspects.length; i++) {
        allSuspects[i].style.backgroundColor = 'white';
    }

    suspectDiv.style.backgroundColor = '#ffcccc';
    selectedSuspect = name;
}

function checkAnswer() {
    if (!selectedSuspect) {
        showMessage('용의자를 먼저 선택하세요');
        return;
    }

    var currentStageDiv = stages[currentStage];
    var culprit = currentStageDiv.querySelector('.culprit').dataset.name;
    
    if (selectedSuspect == culprit) {
        showMessage('정답입니다!');
        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('next-stage').style.display = 'block';
    } else {
        showMessage('틀렸습니다! 다시 생각해보세요.');
    }
}

function goNextStage() {
    if (currentStage < stages.length - 1) {
        currentStage++;
        selectedSuspect = null;
        showStage(currentStage);
        document.getElementById('submit-answer').style.display = 'block';
        document.getElementById('next-stage').style.display = 'none';
        updateStageNumber();
    } else {
        gameEnd();
    }
}

function showStage(stageNum) {
    for (var i = 0; i < stages.length; i++) {
        stages[i].style.display = (i == stageNum) ? 'block' : 'none';
    }
}

function updateStageNumber() {
    document.getElementById('current-stage').textContent = currentStage + 1;
}

function showMessage(msg) {
    var messageDiv = document.getElementById('result-modal');
    messageDiv.innerHTML = '<div>' + msg + '</div>' +
                          '<button onclick="hideMessage()">확인</button>';
    messageDiv.style.display = 'block';
}

function hideMessage() {
    document.getElementById('result-modal').style.display = 'none';
}

function gameEnd() {
    showMessage('게임 완료!');
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-stage').style.display = 'none';
}

function restartGame() {
    currentStage = 0;
    selectedSuspect = null;
    updateStageNumber();
    showStage(0);
    document.getElementById('submit-answer').style.display = 'block';
    document.getElementById('next-stage').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
    
    for (var i = 0; i < stages.length; i++) {
        var suspects = stages[i].querySelectorAll('.suspect');
        for (var j = 0; j < suspects.length; j++) {
            suspects[j].style.backgroundColor = 'white';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    startGame();
});
