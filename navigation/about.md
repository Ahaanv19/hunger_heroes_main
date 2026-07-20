---
layout: base
title: About
nav: true
description: About TCG Collect
permalink: /about/
categories: [About]
---

## What this is

TCG Collect is a Pokémon TCG collection tracker with two things the existing tools
don't have: **prices compared across marketplaces instead of just one**, and a
**searchable directory of card shows** wired directly to your want list.

## The problem

Collectors currently juggle three disconnected tools:

- **TCGplayer** tells you what TCGplayer charges. It has no reason to tell you Cardmarket
  is cheaper, or that recent eBay completions came in well under the listed price.
- **Collectr / TCGCollect** track what you own, but treat your collection as a static
  ledger. They don't help you buy anything.
- **Card shows** — Collect-A-Con, regionals, local monthly shows — are advertised across
  scattered Instagram posts, Facebook groups, and promoter sites with no central listing.

The gap between them is where collectors lose money. You're at a booth, a vendor quotes
you $80 for a card, and you have no fast way to know it's a $30 card.

## The approach

**Cross-vendor pricing.** Every card stores TCGplayer (USD) and Cardmarket (EUR) prices
side by side, ranked cheapest-first, with an eBay sold-listings link so you can check real
completed sales rather than asking prices.

**Collection as a portfolio.** Record what you paid per lot, and the app computes
unrealized gain/loss, best and worst performers, and set-completion percentage — including
exactly which cards you're missing and what it would cost to finish, cheapest first.

**Show Mode.** Your want list, on your phone, at a show. Each card shows the live market
price next to the maximum you decided you'd pay. Set a budget and the planner picks the
most gaps you can close with it.

## How it works

- **Frontend** — Jekyll + Tailwind, served from GitHub Pages.
- **Backend** — Flask + SQLAlchemy, JWT auth, SQLite in development and MySQL in production.
- **Card data** — mirrored from the [Pokémon TCG API](https://pokemontcg.io) into local
  tables, so browse pages stay fast and daily price snapshots accumulate into real history.

## Attribution

Card data, images, and pricing come from the Pokémon TCG API. TCG Collect is an
independent project and is not affiliated with, endorsed by, or sponsored by Nintendo,
Game Freak, Creatures Inc., or The Pokémon Company.
