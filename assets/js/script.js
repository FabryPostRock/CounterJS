const genderFigures = {
  man: [
    {
      title: "",
      imgUrl: "assets/img/man_level1.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/man_level2.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/man_level3.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/man_level4.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/man_level5.png",
      description: "",
    },
  ],
  woman: [
    {
      title: "",
      imgUrl: "assets/img/woman_level1.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/woman_level2.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/woman_level3.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/woman_level4.png",
      description: "",
    },
    {
      title: "",
      imgUrl: "assets/img/woman_level5.png",
      description: "",
    },
  ],
};

let isCountTimeoutStarted = false;
function openGenderSelModal() {
  try {
    const mod = document.getElementById("genderSel");
    const modal = new bootstrap.Modal(mod, { focus: true });
    const closeButtons = document.querySelectorAll(
      'button[name="genderSelection"][data-bs-dismiss="modal"]'
    );
    // disable close modal buttons
    closeButtons.forEach((btn) => btn.setAttribute("disabled", true));
    // hide the modal
    mod.addEventListener("hide.bs.modal", () => {
      const active = document.activeElement;
      if (active && mod.contains(active)) {
        active.blur();
      }
    });
    // move the focus from the modal to the main page when the modal is hidden
    mod.addEventListener("hidden.bs.modal", () => {
      document.querySelector("#h1-procastination")?.focus();
      isCountTimeoutStarted = true;
    });

    modal.show();
  } catch (e) {
    console.error(e);
  }
}

function updateSelState(e, radio) {
  try {
    console.log("updateCloseState called!");
    return radio?.selected;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function checkFormValidity(e, btns, sel) {
  console.log("checkFormValidity called!");
  e.preventDefault();
  try {
    // as soon as a radio btn is checked then the close modal btns are enabled
    if (sel?.checked) {
      btns.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute("disabled");
      });
      // selection is saved in a session
      sessionStorage.setItem("gender", sel.value);
    } else {
      throw new Error("sel has not been selected");
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", openGenderSelModal);
let selection = null;
const radios = document.querySelectorAll('input[name="genderSelection"]');
const closeButtons = document.querySelectorAll(
  'button[name="genderSelection"][data-bs-dismiss="modal"]'
);
radios.forEach((r) => {
  //only the triggered event executes the callback to return the selection
  r.addEventListener("click", (event) => {
    selection = r;
  });
});

const form = document.querySelector("#form-gender-sel");
form.addEventListener("submit", (event) =>
  checkFormValidity(event, closeButtons, selection)
);

// Gestione del count delle reazioni e cambio figure in funzione del risultato ottenuto
let p = document.querySelector("#reaction-counter");
let nCount = 0;
const TOTAL_COUNTS_LEVELS = [0, -10, -5, -2, 3, 6];

function countReactions(reactionType, el) {
  const gender = sessionStorage.getItem("gender");
  let actualFigure;
  let idxFigure;
  if (reactionType === "up") {
    el.textContent = toString(nCount++);
  } else {
    el.textContent = toString(nCount--);
  }

  if (nCount <= TOTAL_COUNTS_LEVELS[1]) {
    console.log("Selected Fig 1");
    idxFigure = 1;
  } else if (nCount <= TOTAL_COUNTS_LEVELS[2]) {
    console.log("Selected Fig 2");
    idxFigure = 2;
  } else if (nCount <= TOTAL_COUNTS_LEVELS[3]) {
    console.log("Selected Fig 3");
    idxFigure = 3;
  } else if (
    nCount >= TOTAL_COUNTS_LEVELS[4] &&
    nCount < TOTAL_COUNTS_LEVELS[5]
  ) {
    console.log("Selected Fig 4");
    idxFigure = 4;
  } else if (nCount >= TOTAL_COUNTS_LEVELS[5]) {
    console.log("Selected Fig 5");
    idxFigure = 5;
  }

  if (gender === "man") {
    actualFigure = genderFigures.man[idxFigure];
  } else {
    actualFigure = genderFigures.woman[idxFigure];
  }
  return actualFigure;
}

/*-------------------------------TIMER COUNTDOWN-----------------------------------------------*/
// Quando si chiude la modale iniziale parte il conteggio per catturare i thumb up/down
const COUNT_TIMER = 15000;
const TIME_TICKS = 1000; //1s
const SECOND = 1000;
const RESET_CMD_TIMER = 500;
let gProgress = 0;
let gRemaining = 0;
let gTimerState = "";
let gTimerDone = false;

function sleepWithProgressOnce(
  totalMs,
  onTick,
  tickMs = 100,
  // getCmd = () => null serve perchè la variabile passata non è mutabile quindi il suo aggiornamento non viene visto una volta chiamata la funzione
  getCmd = () => null
) {
  let timeDelayID = null;
  let timeTicksId = null;
  let startTime = null;
  let res; // <- qui salvo cosa ritorna onTick
  let endState;
  let cmdOut;
  let cmdOld;
  let elapsedTime = 0;
  let remainingTime = 0;
  let elapsed = "";
  let remaining = "";

  const mngTimerDelay = (
    resolve,
    init = false,
    restart = false,
    elapsed,
    remaining,
    cmd
  ) => {
    cmdOut = null;
    startTime = performance.now();
    clearTimeout(timeDelayID);

    if (init) {
      timeDelayID = setTimeout(() => {
        clearInterval(timeTicksId);
        endState = {
          elapsed: totalMs,
          remaining: 0,
          cmd: cmd,
        };
        resolve(endState);
      }, totalMs);
    } else if (restart) {
      clearInterval(timeTicksId);
      endState = {
        elapsed: elapsed,
        remaining: remaining,
        cmd: cmd,
      };
      resolve(endState);
    } else {
      clearInterval(timeTicksId);
      endState = {
        elapsed: elapsed,
        remaining: remaining,
        cmd: cmd,
      };
      resolve(endState);
    }
  };

  return new Promise((resolve) => {
    timeTicksId = setInterval(() => {
      function resetProgressTimers() {
        // resetta i contatori temporali
        elapsedTime = Math.floor((performance.now() - startTime) / SECOND);
        elapsed = elapsedTime.toFixed(0);
        remainingTime = Math.max(0, totalMs - elapsed) / SECOND;
        remaining = remainingTime.toFixed(0);
      }

      resetProgressTimers();
      // legge gli aggiornamenti realtime della variabile esterna
      const cmd = getCmd();
      if (cmdOld != cmd && cmd) {
        cmdOut = cmd;
        cmdOld = cmd;
        console.log(`cmdOut : ${cmdOut}    cmdOld: ${cmdOld}    cmd: ${cmd}`);
      }

      if (cmdOut === "reset") {
        console.log("reset event received!");
        startTime = performance.now();
        resetProgressTimers();
        mngTimerDelay(resolve, false, true, elapsed, remaining, "reset");
        return;
      } else if (cmdOut === "stop") {
        console.log("stop event received!");
        mngTimerDelay(resolve, false, false, elapsed, remaining, "stopped");
        return;
      } else {
        console.log("runnning!");
        res = onTick?.({
          elapsed: elapsed,
          remaining: remaining,
          cmd: "running",
        });
      }
    }, tickMs);
    mngTimerDelay(resolve, true, false, 0, COUNT_TIMER, "finished");
  });
}

let btnCmd = null;
let btnReset = document.querySelector("#btn-reset");
btnReset.addEventListener("click", () => {
  btnCmd = "reset";
  setTimeout(() => {
    btnCmd = null;
  }, RESET_CMD_TIMER);
});

/*let btnStop = document.querySelector("#btn-stop");
btnStop.addEventListener("click", () => {
  btnCmd = "stop";
  setTimeout(() => {
    btnCmd = null;
  }, RESET_CMD_TIMER);
});*/

let btnStart = document.querySelector("#btn-start");
btnStart.addEventListener("click", async () => {
  try {
    if (!cycle) {
      btnCmd = "start";
      await startTimer();
      setTimeout(() => {
        btnCmd = null;
      }, RESET_CMD_TIMER);
    }
  } catch (e) {
    console.error("startTimer error:", e);
  }
});

async function sleepWithProgressAutoRestart(totalMs, onTick, tickMs, cmd) {
  while (true) {
    const endState = await sleepWithProgressOnce(totalMs, onTick, tickMs, cmd);
    console.log("AAAAAAAAAAAAAAAA", endState.cmd);
    // Se reset, salta il codice che termina l'esecuzione e riparti: nuova Promise
    if (endState.cmd === "reset") continue;
    console.log("BBBBBBBBBBBBBBBBB");
    // Se stopped o finished, esci e ritorna lo stato finale
    return endState;
  }
}

let cycle = null;
let timerUpdatesId = null;

async function startTimer() {
  timerUpdatesId = setInterval(() => {
    console.log("LIVE:", gProgress, gRemaining, gTimerState);
  }, TIME_TICKS);

  cycle = await sleepWithProgressAutoRestart(
    COUNT_TIMER,
    ({ elapsed, remaining, cmd }) => {
      gProgress = elapsed;
      gRemaining = remaining;
      gTimerState = cmd;
      return { elapsed, remaining, cmd };
    },
    100,
    () => btnCmd
  ).then((endState) => {
    clearInterval(timerUpdatesId);
    console.log("Esecuzione completata!", { ...endState });
  });
}

/*---------------------------------------------THUMB UP/DOWN REACTION---------------------------------------------*/
let actualFig;
document.querySelectorAll(".btn-reaction").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.reaction; // "up" | "down" coming from the data-reaction button attribute
    spawnReaction(btn, type);
    actualFig = countReactions(type);
  });
});

function spawnReaction(btn, type) {
  const span = document.createElement("span");
  // Google Font Icon Version
  span.className =
    "material-symbols-outlined g-icon-secondary-color floating-reaction";
  span.textContent = type === "up" ? "thumb_up" : "thumb_down";
  // random live-like
  const drift = rand(-18, 18); // spostamento laterale
  const rise = rand(90, 160); // quanto sale
  const rot = rand(-18, 18); // rotazione
  const dur = rand(700, 1100); // durata
  const scale = rand(0.75, 1.25); // scala finale

  // creaimo le proprietà che poi verranno richiamate in '@keyframes floatUp'
  span.style.setProperty("--drift", `${drift}px`);
  span.style.setProperty("--rise", `${rise}px`);
  span.style.setProperty("--rot", `${rot}deg`);
  span.style.setProperty("--dur", `${dur}ms`);
  span.style.setProperty("--scale", scale);

  span.addEventListener("animationstart", () => {
    console.log("animationstart fired", getComputedStyle(span).animationName);
  });
  btn.appendChild(span);
  // pulizia a fine animazione
  span.addEventListener("animationend", () => span.remove());
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
