export class DataFetcher {
  constructor() {
    this.cache = new Map();
    this.isLoading = new Set();
  }

  async fetchCategoryData(category) {
    if (this.cache.has(category)) {
      return this.cache.get(category);
    }

    if (this.isLoading.has(category)) {
      // Wait for existing request to complete
      while (this.isLoading.has(category)) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return this.cache.get(category) || [];
    }

    this.isLoading.add(category);

    try {
      const response = await fetch(`src/data/${category}.json`);
      if (!response.ok) {
        console.warn(`No data file found for ${category}, using sample data`);
        return this.getSampleData(category);
      }
      const data = await response.json();
      this.cache.set(category, data);
      return data;
    } catch (error) {
      console.warn(
        `Error fetching ${category} data, using sample data:`,
        error
      );
      return this.getSampleData(category);
    } finally {
      this.isLoading.delete(category);
    }
  }

  getSampleData(category) {
    const sampleData = {
      theater: [
        {
          id: 1,
          title: "De Kleine Zeemeermin",
          description: [
            "Hoofdrol als Ariel in de musical productie van De Kleine Zeemeermin.",
          ],
          image: "src/images/theater1.jpg",
          category: "theater",
          year: "2023",
        },
        {
          id: 2,
          title: "Mamma Mia",
          description: ["Rol van Sophie in de populaire ABBA musical."],
          image: "src/images/theater2.jpg",
          category: "theater",
          year: "2022",
        },
      ],
      "tv-film": [
        {
          id: 3,
          title: "Familie TV Serie",
          description: ["Gastrol in de populaire Vlaamse TV-serie Familie."],
          image: "src/images/tv1.jpg",
          category: "tv-film",
          year: "2023",
        },
      ],
      zang: [
        {
          id: 4,
          title: "Solo Concert",
          description: ["Optreden in het Concertgebouw met eigen repertoire."],
          image: "src/images/zang1.jpg",
          category: "zang",
          year: "2023",
        },
      ],
      stemacteur: [
        {
          id: 5,
          title: "Animatie Film",
          description: [
            "Nederlandse stemmen voor internationale animatiefilm.",
          ],
          image: "src/images/voice1.jpg",
          category: "stemacteur",
          year: "2023",
        },
      ],
      onderwijs: [
        {
          id: 6,
          title: "Zangworkshops",
          description: ["Lesgeven aan jonge talenten in zang en performance."],
          image: "src/images/onderwijs1.jpg",
          category: "onderwijs",
          year: "2023",
        },
      ],
    };

    const data = sampleData[category] || [];
    this.cache.set(category, data);
    return data;
  }

  async fetchAllData() {
    const categories = [
      "theater",
      "tv-film",
      "zang",
      "stemacteur",
      "onderwijs",
    ];

    try {
      const promises = categories.map((category) =>
        this.fetchCategoryData(category)
      );
      const results = await Promise.all(promises);

      const allData = [];
      results.forEach((categoryData) => {
        allData.push(...categoryData);
      });

      return allData;
    } catch (error) {
      console.error("Error fetching all data:", error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
