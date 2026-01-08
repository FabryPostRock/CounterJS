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
      console.log("new focus on body!");
      document.querySelector("#h1-procastination")?.focus();
    });

    modal.show();
  } catch (e) {
    console.error(e);
  }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
function checkFormValidity(e) {
  function updateCloseState(btns) {
    try {
      const selected = document.querySelector(
        'input[name="genderSelection"]:checked'
      );
      btns.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute("disabled");
      });
      sessionStorage.setItem("gender", selected.value);
    } catch (e) {
      console.error(e);
    }
  }

  e.preventDefault(); // impedisce l'invio del form
  const radios = document.querySelectorAll('input[name="genderSelection"]');
  const closeButtons = document.querySelectorAll(
    'button[name="genderSelection"][data-bs-dismiss="modal"]'
  );
  radios.forEach((r) => {
    console.log(Date.now());
    r.addEventListener("change", updateCloseState(closeButtons));
  });
}

document.addEventListener("DOMContentLoaded", openGenderSelModal);
const form = document.querySelector("#form-gender-sel");
form.addEventListener("submit", checkFormValidity);

document.querySelectorAll(".btn-reaction").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.reaction; // "up" | "down" coming from the data-reaction button attribute
    spawnReaction(btn, type);
  });
});

function animationStart(span, type) {
  // imposto a hidden altrimenti potrebbe comparire un elemento all'interno del pulsante con font grande come il like se non venisse consumato subito dall'animazione.
  span.style.display = "none";
  // Google Font Icon Version
  span.className =
    "material-symbols-outlined g-icon-secondary-color floating-reaction";
  span.textContent = type === "up" ? "thumb_up" : "thumb_down";
}

function spawnReaction(buttonEl, type) {
  const span = document.createElement("span");

  // random live-like
  const drift = rand(-18, 18); // spostamento laterale
  const rise = rand(90, 160); // quanto sale
  const rot = rand(-18, 18); // rotazione
  const dur = rand(700, 1100); // durata
  const scale = rand(0.95, 1.25); // scala finale

  // creaimo le proprietà che poi verranno richiamate in '@keyframes floatUp'
  span.style.setProperty("--drift", `${drift}px`);
  span.style.setProperty("--rise", `${rise}px`);
  span.style.setProperty("--rot", `${rot}deg`);
  span.style.setProperty("--dur", `${dur}ms`);
  span.style.setProperty("--scale", scale);

  span.addEventListener("animationstart", animationStart(span, type));
  buttonEl.appendChild(span);
  // pulizia a fine animazione
  span.addEventListener("animationend", () => span.remove());
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
