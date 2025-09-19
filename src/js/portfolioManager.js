import { DataFetcher } from "./dataFetcher.js";

export class PortfolioManager {
  constructor() {
    this.dataFetcher = new DataFetcher();
    this.currentFilter = "all";
    this.allItems = [];
    this.gridContainer = null;
    this.filterButtons = null;
    this.isInitialLoad = true;
  }

  init() {
    console.log("Initializing PortfolioManager...");
    this.gridContainer = document.getElementById("portfolio-grid");
    this.filterButtons = document.querySelectorAll(".filter-btn");

    if (!this.gridContainer) {
      console.error("Portfolio grid container not found");
      return;
    }

    if (this.filterButtons.length === 0) {
      console.error("No filter buttons found");
      return;
    }

    console.log(`Found ${this.filterButtons.length} filter buttons`);
    this.setupEventListeners();
    this.loadAllData();
  }

  setupEventListeners() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = button.dataset.filter;
        console.log(`Filter clicked: ${filter}`);
        this.setActiveFilter(button);
        this.filterItems(filter);
      });
    });
  }

  setActiveFilter(activeButton) {
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  async loadAllData() {
    try {
      console.log("Loading all portfolio data...");
      this.showLoading();
      this.allItems = await this.dataFetcher.fetchAllData();
      console.log(`Loaded ${this.allItems.length} portfolio items`);

      // Only show preview items on initial load
      if (this.isInitialLoad) {
        const previewItems = this.getPreviewItems();
        this.renderItems(previewItems);
        this.showPreviewMessage();
      } else {
        this.renderItems(this.allItems);
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      this.showError();
    }
  }

  getPreviewItems() {
    // Show max 2 items from different categories as preview
    const previewItems = [];
    const usedCategories = new Set();

    for (const item of this.allItems) {
      if (previewItems.length >= 2) break;

      if (!usedCategories.has(item.category)) {
        previewItems.push(item);
        usedCategories.add(item.category);
      }
    }

    return previewItems;
  }

  async filterItems(category) {
    console.log(`Filtering to category: ${category}`);
    this.currentFilter = category;
    this.isInitialLoad = false; // No longer initial load

    this.setButtonsState(false);
    this.fadeOutItems();
    this.hidePreviewMessage();

    setTimeout(async () => {
      let itemsToShow = [];

      if (category === "all") {
        itemsToShow = this.allItems;
      } else if (category === "onderwijs") {
        // Special handling for onderwijs - show PDF
        this.renderPDF();
        this.setButtonsState(true);
        return;
      } else {
        itemsToShow = await this.dataFetcher.fetchCategoryData(category);
      }

      console.log(`Showing ${itemsToShow.length} items for ${category}`);
      this.renderItems(itemsToShow);
      this.setButtonsState(true);
    }, 300);
  }

  renderPDF() {
    if (!this.gridContainer) return;

    setTimeout(() => {
      this.gridContainer.innerHTML = "";

      const pdfContainer = this.createPDFElement();
      this.gridContainer.appendChild(pdfContainer);

      // Force reflow and trigger animation
      pdfContainer.offsetHeight;
      setTimeout(() => {
        pdfContainer.classList.add("portfolio-item-animating");
      }, 100);
    }, 50);
  }

  createPDFElement() {
    const pdfDiv = document.createElement("div");
    pdfDiv.className = "portfolio-item pdf-viewer-container";

    pdfDiv.innerHTML = `
      <div class="pdf-header">
        <h3>Onderwijs</h3>
        <div class="pdf-controls">
          <a href="src/images/Onderwijs.pdf" target="_blank" class="pdf-download-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </a>
        </div>
      </div>
      <div class="pdf-viewer">
        <iframe 
          src="src/images/Onderwijs.pdf" 
          type="application/pdf"
          title="Onderwijs Portfolio PDF"
          loading="lazy">
          <p>Je browser ondersteunt geen PDF weergave. 
            <a href="src/images/Onderwijs.pdf" target="_blank">Klik hier om de PDF te downloaden</a>
          </p>
        </iframe>
      </div>
      <div class="portfolio-item-content">
        <p>Mijn ervaring en kwalificaties in het onderwijs.</p>
        <span class="category">${this.getCategoryLabel("onderwijs")}</span>
      </div>
    `;

    return pdfDiv;
  }

  showPreviewMessage() {
    // Add preview message after the grid
    const existingMessage = document.querySelector(".preview-message");
    if (existingMessage) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "preview-message";
    messageDiv.style.cssText = `
      text-align: center;
      margin-top: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%);
      border-radius: 8px;
      border: 1px solid rgba(44, 44, 44, 0.08);
    `;

    messageDiv.innerHTML = `
      <p style="
        font-family: 'Fjalla One', sans-serif;
        font-size: 1.1rem;
        color: #2c2c2c;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      ">Selecteer een categorie om meer werk te bekijken</p>
      <p style="
        font-family: 'source sans pro', sans-serif;
        font-size: 0.9rem;
        color: #666;
        margin: 0;
      ">Gebruik de filter knoppen hierboven om specifieke categorieën te verkennen.</p>
    `;

    this.gridContainer.parentNode.appendChild(messageDiv);
  }

  hidePreviewMessage() {
    const messageDiv = document.querySelector(".preview-message");
    if (messageDiv) {
      messageDiv.remove();
    }
  }

  setButtonsState(enabled) {
    this.filterButtons.forEach((btn) => {
      btn.disabled = !enabled;
      btn.style.opacity = enabled ? "1" : "0.6";
      btn.style.pointerEvents = enabled ? "auto" : "none";
    });
  }

  fadeOutItems() {
    const items = this.gridContainer.querySelectorAll(".portfolio-item");
    items.forEach((item, index) => {
      // Remove any existing animation classes first
      item.classList.remove("portfolio-item-animating");
      setTimeout(() => {
        item.classList.add("fade-out");
      }, index * 20);
    });
  }

  renderItems(items) {
    if (!this.gridContainer) return;

    setTimeout(() => {
      this.gridContainer.innerHTML = "";

      if (items.length === 0) {
        this.showNoResults();
        return;
      }

      items.forEach((item, index) => {
        const itemElement = this.createItemElement(item);
        this.gridContainer.appendChild(itemElement);

        // Force reflow to ensure element is in DOM
        itemElement.offsetHeight;

        // Trigger animation with proper delay
        setTimeout(() => {
          itemElement.classList.add("portfolio-item-animating");
        }, index * 80 + 100);
      });
    }, 50);
  }

  createItemElement(item) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "portfolio-item";

    const imageHtml = item.image
      ? `<img src="${item.image}" alt="${item.title}" loading="lazy">`
      : "";

    // Function to create audio player element
    function createAudioPlayer(audioSrc, title) {
      if (!audioSrc) return "";

      return `
        <div class="audio-section">
            <h4>Luister fragment:</h4>
            <audio controls preload="metadata" class="audio-player">
                <source src="${audioSrc}" type="audio/mpeg">
                <source src="${audioSrc.replace(
                  ".mp3",
                  ".wav"
                )}" type="audio/wav">
                Je browser ondersteunt geen audio element.
            </audio>
        </div>
    `;
    }

    const audioPlayer = createAudioPlayer(item.audio, item.title);

    // Handle description - only show if it exists and is not empty
    let descriptionHtml = "";
    if (item.description && item.description.length > 0) {
      if (Array.isArray(item.description)) {
        descriptionHtml = `<ul>${item.description
          .map((line) => `<li>${line}</li>`)
          .join("")}</ul>`;
      } else {
        descriptionHtml = `<ul><li>${item.description}</li></ul>`;
      }
    }

    itemDiv.innerHTML = `
      ${imageHtml}
      <div class="portfolio-item-content">
        <h3>${item.title}</h3>
        ${descriptionHtml}
        <span class="category">${this.getCategoryLabel(item.category)}</span>
      </div>
      ${audioPlayer}
    `;
    return itemDiv;
  }

  getCategoryLabel(category) {
    const labels = {
      theater: "Theater",
      "tv-film": "TV & Film",
      zang: "Zang",
      stemacteur: "Stemacteur",
      onderwijs: "Onderwijs",
    };
    return labels[category] || category;
  }

  showLoading() {
    this.gridContainer.innerHTML = `
      <div class="portfolio-loading" style="
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
        font-size: 1.3rem;
        color: #444;
        font-family: 'Fjalla One', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        background: linear-gradient(90deg, #f8fafc 0%, #e8eaf6 100%);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        margin: 2rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        Portfolio items laden...
      </div>
    `;
  }

  showNoResults() {
    this.gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; color: #666; font-family: 'Fjalla One', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Geen resultaten gevonden voor deze categorie.</p>
      </div>
    `;
  }

  showError() {
    this.gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; color: #e74c3c; font-family: 'Fjalla One', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Er is een fout opgetreden bij het laden van de portfolio items.</p>
      </div>
    `;
  }
}
