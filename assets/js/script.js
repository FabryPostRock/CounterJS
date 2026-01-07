document.querySelectorAll(".btn-reaction").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.reaction; // "up" | "down"
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
