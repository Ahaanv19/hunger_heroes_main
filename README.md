# TCG Collect — Frontend

Jekyll frontend for **TCG Collect**, a Pokémon TCG collection tracker with cross-vendor
price comparison and a card-show directory.

The pitch: TCGplayer is a store, Collectr is a ledger, and neither knows the in-person
market exists. TCG Collect compares prices across marketplaces, tracks your collection as
a portfolio with real cost basis, and maps your want list onto the actual card-show
circuit — so you can check a vendor's asking price against the market while standing at
their booth.

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page |
| `/cards` | Card browser — search, filter by set/rarity/price, paginated grid |
| `/card?id=` | Card detail — art, cross-vendor buy options, 90-day price chart |
| `/sets` | Every set, filterable by series |
| `/collection` | Portfolio — market value, cost basis, unrealized gain/loss |
| `/completion` | Set completion %, missing cards, cost to finish |
| `/wantlist` | Cards you're hunting, with your max bid per card |
| `/show-mode` | Want list + live prices + budget planner, built for a card show |
| `/shows` | Card show directory — search by text, state, or radius from your location |
| `/movers` | Biggest price swings over a chosen window |

## Backend

A **single Flask backend** serves everything — catalog, auth, collection, and shows.
(The former Spring Boot service has been retired; there is no `javaURI` anymore.)

Configure the endpoint in [`assets/js/api/config.js`](assets/js/api/config.js):

```js
pythonURI = "http://localhost:8288";   // local
// production: https://tcgcollect.opencodingsociety.com
```

All requests go through the helpers in
[`assets/js/api/tcgApi.js`](assets/js/api/tcgApi.js), which return parsed JSON and throw
on failure so each page renders a single error state.

## Setup

1. Install Ruby and Bundler.

   ```bash
   gem install bundler:2.7.2
   bundle install
   ```

2. Start the backend (see the backend repo's README) so the pages have data to load.

3. Start the site:

   ```bash
   make
   # or
   bundle exec jekyll serve -H 127.0.0.1 -P 4887
   ```

   Then open <http://127.0.0.1:4887/tcg_collect/>.

## Note on `baseurl`

`_config.yml` sets `baseurl: "/tcg_collect"`, which must match the GitHub repository name.
Rename the repo to `tcg_collect` on GitHub, or change `baseurl` and `github_repo` back to
whatever the repo is actually called — otherwise GitHub Pages will 404 on every asset.

## Design

Dark "display case" palette: low-chroma slate surfaces so card art carries the color.
Violet (`primary`) is the interactive brand color; gold (`accent`) is reserved strictly
for rarity signals — chase cards, secret rares, completion milestones. Using gold
decoratively drains its meaning.

Tokens live in [`_sass/tcg-collect/_design-tokens.scss`](_sass/tcg-collect/_design-tokens.scss)
and are mirrored in the Tailwind config inside [`_layouts/base.html`](_layouts/base.html);
keep the two in sync.

## Attribution

Card data and images come from the [Pokémon TCG API](https://pokemontcg.io). Not
affiliated with Nintendo, Game Freak, or The Pokémon Company.
