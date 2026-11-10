(() => {
  "use strict";
  const details = window.TRAVEL_DETAILS || {};
  const envelopeScreen = document.getElementById("envelope-screen");
  const itineraryScreen = document.getElementById("itinerary-screen");
  const openButton = document.getElementById("open-envelope");
  const closeButton = document.getElementById("close-envelope");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const confetti = document.getElementById("confetti");
  let opening = false;
  let cleanupTimer;

  if (details.arrival) {
    document.querySelectorAll(".arrival-month").forEach(el => { el.textContent = details.arrival; });
  }
  if (details.signOff) document.getElementById("sign-off").textContent = details.signOff;
  if (details.photo) {
    const photo = document.getElementById("personal-photo");
    photo.alt = details.photoAlt || "A photo from the two of us";
    photo.addEventListener("load", () => { document.getElementById("photo-card").hidden = false; });
    photo.src = details.photo;
  }

  function celebrate() {
    if (reducedMotion.matches) return;
    const pieces = document.createDocumentFragment();
    for (let i = 0; i < 38; i++) {
      const piece = document.createElement("i");
      piece.style.setProperty("--left", `${Math.random() * 100}%`);
      piece.style.setProperty("--delay", `${Math.random() * 0.9}s`);
      piece.style.setProperty("--duration", `${2.7 + Math.random() * 1.8}s`);
      piece.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
      piece.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
      piece.className = `piece-${i % 3}`;
      pieces.appendChild(piece);
    }
    confetti.replaceChildren(pieces);
    cleanupTimer = window.setTimeout(() => confetti.replaceChildren(), 5500);
  }

  openButton.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    openButton.disabled = true;
    envelopeScreen.classList.add("is-unsealing");
    openButton.classList.add("is-opening");
    window.setTimeout(() => {
      envelopeScreen.hidden = true;
      itineraryScreen.hidden = false;
      openButton.setAttribute("aria-expanded", "true");
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("reveal-heading").focus({ preventScroll: true });
      celebrate();
    }, reducedMotion.matches ? 0 : 1000);
  });

  closeButton.addEventListener("click", () => {
    window.clearTimeout(cleanupTimer);
    confetti.replaceChildren();
    itineraryScreen.hidden = true;
    envelopeScreen.classList.remove("is-unsealing");
    envelopeScreen.hidden = false;
    openButton.classList.remove("is-opening");
    openButton.setAttribute("aria-expanded", "false");
    openButton.disabled = false;
    opening = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    openButton.focus({ preventScroll: true });
  });
})();
