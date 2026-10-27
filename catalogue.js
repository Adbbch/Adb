/*
  Example: display the generated catalogue on an existing HTML page.
  Add <div id="anime-catalogue"></div> where the cards should appear,
  then include this file with <script src="examples/catalogue.js"></script>.
*/
(async function () {
  const target = document.getElementById("anime-catalogue");
  if (!target) return;

  target.textContent = "Chargement du catalogue…";

  try {
    const response = await fetch("./data/anime.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Catalogue indisponible");
    const catalogue = await response.json();

    target.replaceChildren();
    const status = document.createElement("p");
    status.textContent = `Catalogue actualisé : ${
      catalogue.updatedAt ? new Date(catalogue.updatedAt).toLocaleString() : "en attente"
    }`;
    target.appendChild(status);

    if (!catalogue.items.length) {
      const empty = document.createElement("p");
      empty.textContent = "Aucun anime dans le catalogue pour le moment.";
      target.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "anime-grid";

    for (const anime of catalogue.items) {
      const card = document.createElement("article");
      card.className = "anime-card";

      const link = document.createElement("a");
      link.href = anime.siteUrl || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "anime-card-link";

      const image = document.createElement("img");
      image.loading = "lazy";
      image.alt = anime.title?.english || anime.title?.romaji || "Affiche d’anime";
      image.src = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
      link.appendChild(image);

      const heading = document.createElement("h3");
      heading.textContent = anime.title?.english || anime.title?.romaji || anime.title?.native || "Titre inconnu";
      link.appendChild(heading);

      const details = document.createElement("p");
      const parts = [];
      if (anime.season) parts.push(anime.season);
      if (anime.seasonYear) parts.push(String(anime.seasonYear));
      if (anime.episodes) parts.push(`${anime.episodes} épisodes`);
      details.textContent = parts.join(" · ");
      link.appendChild(details);

      card.appendChild(link);
      grid.appendChild(card);
    }
    target.appendChild(grid);
  } catch (error) {
    target.textContent = "Impossible de charger le catalogue. Vérifie que data/anime.json existe.";
    console.error(error);
  }
})();
