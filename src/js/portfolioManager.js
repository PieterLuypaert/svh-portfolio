import { DataFetcher } from "./dataFetcher.js";

export class PortfolioManager {
  constructor() {
    this.dataFetcher = new DataFetcher();
    this.currentFilter = "all";
    this.allItems = [];
    this.gridContainer = null;
    this.filterButtons = null;
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
      this.renderItems(this.allItems);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      this.showError();
    }
  }

  async filterItems(category) {
    if (this.currentFilter === category) {
      console.log(`Already showing ${category}, skipping`);
      return;
    }

    console.log(`Filtering to category: ${category}`);
    this.currentFilter = category;

    this.setButtonsState(false);
    this.fadeOutItems();

    setTimeout(async () => {
      let itemsToShow = [];

      if (category === "all") {
        itemsToShow = this.allItems;
      } else {
        itemsToShow = await this.dataFetcher.fetchCategoryData(category);
      }

      console.log(`Showing ${itemsToShow.length} items for ${category}`);
      this.renderItems(itemsToShow);
      this.setButtonsState(true);
    }, 300);
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

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="portfolio-item-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="category">${this.getCategoryLabel(item.category)}</span>
      </div>
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
