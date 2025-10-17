# Workshop Management Project

**Hosted by:** Mahan & Mobin Malekjary  
**Repository:** [MahanMalekjary/workshop](https://github.com/MahanMalekjary/workshop)
**GitHub Page** [See Website](https://MahanMalekjary.github.io/workshop)

---

## 📋 Overview

A hands‑on workshop project designed to demonstrate practical web development techniques. The project covers:

- A responsive navigation layout for wide and mobile screens  
- Toggling UI sections without external frameworks  
- Dynamic styling using JavaScript  
- Clean, semantic HTML/CSS/JS implementation  

---

## 🚀 Features

- **Responsive nav menus** for both desktop and mobile  
- **JavaScript logic** to toggle visibility and apply inline styles or class-based styling  
- **Semantic HTML** for accessibility and maintainability  
- **Lightweight, framework-free** design  

---

## 🛠️ Getting Started

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, Safari)  
- Optional: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension or any static server  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/MahanMalekjary/workshop.git
   cd workshop
   ```

2. **Open `index.html`** in your browser or serve via Live Server.

3. **Explore** the nav toggle button and sections (Cost, Customers, Inventory, To‑Do, Invoice, Cheques, History).

---

## 📐 Usage

### CSS Styling via JavaScript

Select an element and modify its style:
```js
const nav = document.getElementById('nav');
nav.style.backgroundColor = '#333';
nav.style.display = 'flex';
```

### Managing visibility with classes

```js
const mobileNav = document.querySelector('.mobilescreenNav');
mobileNav.classList.toggle('open');
```

### Modular section toggling

```js
function showSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.hidden = true);
  document.getElementById(id).hidden = false;
}
```

---

## 🧩 Folder Structure

```
workshop/
├── index.html         # Main page with both navs
├── styles.css         # Styles for desktop & mobile navs
└── script.js          # JS logic: toggling, styling, classList, etc.
```

Adjust names if your files differ.

---

## 📝 Customization Tips

- Prefer `.classList.toggle()` over `.style.*` for maintainable, CSS-driven styling.  
- Replace `<span>` toggles with `<button>` or `<div>` for semantic structure.  
- Ensure valid HTML: block-level sections inside other block-level parents.

---

## ✅ Contributing

Contributions welcome!  
Fork → feature branch → PR → code review → merged.

---

## ℹ️ License

Distributed under the MIT License. See `LICENSE` for details.

---

## 🤝 Contact

**Mahan & Mobin Malekjary** – *Author & Workshop Lead*  
Project link: https://github.com/MahanMalekjary/workshop
