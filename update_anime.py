#!/usr/bin/env python3
"""Fetch anime metadata from AniList and write data/anime.json."""
import json
import os
import urllib.request
from datetime import datetime, timezone

API_URL = "https://graphql.anilist.co"
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "data", "anime.json")

QUERY = """
query ($page: Int, $perPage: Int, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { currentPage hasNextPage }
    media(
      type: ANIME
      seasonYear: $seasonYear
      sort: POPULARITY_DESC
      isAdult: false
    ) {
      id
      siteUrl
      title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge large }
      bannerImage
      episodes
      status
      season
      seasonYear
      genres
      averageScore
      startDate { year month day }
      nextAiringEpisode { episode airingAt timeUntilAiring }
    }
  }
}
"""

def fetch_page(page, year):
    payload = {
        "query": QUERY,
        "variables": {"page": page, "perPage": 50, "seasonYear": year},
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "ADB-Anime-Auto/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        result = json.loads(response.read().decode("utf-8"))
    if "errors" in result:
        raise RuntimeError("AniList API error: " + json.dumps(result["errors"], ensure_ascii=False))
    return result["data"]["Page"]

def main():
    now = datetime.now(timezone.utc)
    year = now.year
    anime = []
    page = 1
    max_pages = 4  # Up to 200 titles; adjust if needed.
    while page <= max_pages:
        data = fetch_page(page, year)
        anime.extend(data["media"])
        if not data["pageInfo"]["hasNextPage"]:
            break
        page += 1

    # Keep the output predictable and compact.
    output = {
        "updatedAt": now.isoformat(),
        "source": "AniList API",
        "items": anime,
    }
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {len(anime)} anime entries to {OUTPUT}")

if __name__ == "__main__":
    main()
