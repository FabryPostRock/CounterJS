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

function openGenderSelModal() {
  try {
    const mod = document.getElementById("genderSel");
    const modal = new bootstrap.Modal(mod, { focus: true });
    const closeButtons = document.querySelectorAll(
      'button[name="genderSelection"][data-bs-dismiss="modal"]'
    );
    closeButtons.forEach((btn) => btn.setAttribute("disabled", true));
    mod.addEventListener("hide.bs.modal", () => {
      const active = document.activeElement;
      if (active && mod.contains(active)) {
        active.blur();
      }
    });
    mod.addEventListener("hidden.bs.modal", () => {
      document.querySelector("#h1-procastination")?.focus();
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

// Example starter JavaScript for disabling form submissions if there are invalid fields
function checkFormValidity(e, btns, sel) {
  console.log("checkFormValidity called!");
  e.preventDefault();
  try {
    if (sel?.checked) {
      btns.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute("disabled");
      });
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

document.querySelectorAll(".btn-reaction").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.reaction; // "up" | "down" coming from the data-reaction button attribute
    spawnReaction(btn, type);
  });
});

function spawnReaction(btn, type) {
  const span = document.createElement("span");
  // imposto a hidden altrimenti potrebbe comparire un elemento all'interno del pulsante con font grande come il like se non venisse consumato subito dall'animazione.
  //span.style.display = "none";
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
