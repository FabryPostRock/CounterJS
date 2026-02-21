<a id="readme-top"></a>

[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/products/hosting)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fabrizio-de-masi-55016088/)

<br />
<div align="center">
  <a href="#">
    <img src="assets/img/logo-procastination.png" alt="Logo" width="90" height="90">
  </a>

<h3 align="center">Procastination Counter</h3>

  <p align="center">
    Un mini-gioco web (stile anti-procrastination) per tracciare, con un tocco ironico, quante volte hai procrastinato oggi: scegli il genere, avvia un countdown, premi pollice su/giù e alla fine ottieni una “game card” in base al punteggio.
    <br />
    <br />
    <a href="https://procastination-counter-9e086.web.app"><strong>View Demo</strong></a>
  </p>
</div>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run locally](#run-locally)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## About The Project

Il progetto è una web app single page pubblicata su Firebase Hosting (con rewrite a `index.html`).

All’avvio:

- viene mostrata una **modale** per la scelta del genere man/woman e la selezione viene salvata in **sessionStorage**
- la UI viene **creata dinamicamente** via JavaScript (niente `innerHTML`: nodi creati con `document.createElement`, attributi, classi, append)
- l’utente può avviare il **countdown** (15s) e durante il conteggio può cliccare **thumb up/down**: ogni click aggiorna il contatore e fa partire una piccola animazione floating_reaction
- allo scadere del timer, viene mostrata una **modale risultato** con una card (immagine + titolo + descrizione) aggiornata dinamicamente in base a soglie di punteggio
- la pagina include meta SEO/OG e dati strutturati JSON-LD

In più è presente una componente **PWA**:

- registrazione del Service Worker (`/serviceWorker.js`)
- caching offline app shell e strategia fetch
- base per notifiche push (Firebase Cloud Messaging) via Service Worker

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Built With

- HTML5 / Vanilla JS
- Bootstrap 5.3.8
- SCSS/CSS con personalizzazioni (variabili CSS + animazioni custom)
- Firebase Hosting
- Service Worker (PWA) + cache offline

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

### Prerequisites

- **Visual Studio Code**
- Estensione VSCode: **Live Server** (Ritwick Dey)
- (Opzionale) Node.js + npm se vuoi gestire dipendenze (Bootstrap via NPM)
- (Opzionale) Firebase CLI se vuoi fare deploy su Firebase Hosting

### Installation

1. Clona il repository (sostituisci con l’URL reale)
   ```sh
   git clone https://github.com/FabryPostRock/CounterJs.git
   ```
2. Entra nella cartella progetto
   ```sh
   cd CounterJs/assets/
   ```
3. (Opzionale) Installa dipendenze bootstrap, firebase e firebase tools
   ```sh
   npm i bootstrap
   npm i firebase
   npm i -g firebase-tools
   ```

### Run locally

Per testare correttamente **Service Worker / PWA** serve un server su `localhost` (non aprire `index.html` con doppio click).

**Con VSCode Live Server:**

1. Apri la cartella del progetto in VSCode
2. Installa l’estensione **Live Server** (se non l’hai già)
3. Apri `index.html`
4. Clicca **Go Live** (in basso a destra) oppure tasto destro → **Open with Live Server**
5. Apri l’URL che ti mostra Live Server (di solito `http://127.0.0.1:5500/`)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Usage

1. Apri la web app / demo: https://procastination-counter-9e086.web.app
2. Seleziona il genere nella modale iniziale
3. Premi **Start** per avviare il countdown (15 secondi)
4. Durante il countdown, premi **thumb up/down**
5. Alla fine compare la **result modal** con la card aggiornata (img/title/description)

---

## Project Structure

- `index.html`
  - meta SEO/OG + JSON-LD
  - include Bootstrap (CDN) e script `pageBuild.js` + `script.js`

- `assets/js/pageBuild.js`
  - helper `el(tag, options)`
  - costruzione dinamica del body (counters, bottoni, controlli start/stop/reset)
  - costruzione dinamica delle modali `genderSel` e `playerResult`

- `assets/js/script.js`
  - logica del gioco: gender selection, reaction count, soglie punteggio
  - timer async con comandi start/stop/reset
  - aggiornamento dinamico della “result card” nella modale
  - registrazione Service Worker

- `assets/css/scss/main.scss`
  - variabili, stili custom e animazioni

- `serviceWorker.js`
  - caching offline + fetch strategy

- `firebase.json`
  - hosting con rewrite a `/index.html`

---

## Roadmap

- [ ] Persistenza punteggi (localStorage o backend)
- [ ] Pannello statistiche giornaliere/settimanali
- [ ] Miglioramento accessibilità (focus management completo + aria labels più granulari)
- [ ] Notifiche push (completare il flusso end-to-end client + permessi)

---

## License

Nessuna licenza specificata nel progetto al momento (TBD).

---

## Contact

**FabryPostRock (Fabrizio De Masi)**  
LinkedIn: https://www.linkedin.com/in/fabrizio-de-masi-55016088/
