# Olaniyi Muiez Kolawole · Portfolio

Personal portfolio of Olaniyi Muiez Kolawole, Frontend Engineer. It covers experience, projects, skills, education and contact details.

Live: https://olaniyi-kolawole-portfolio.onrender.com

## Stack

Plain HTML, CSS and vanilla JavaScript, with no build step and no dependencies.

- `index.html`: all page content
- `assets/css/styles.css`: design tokens (dark and light themes) and all styles
- `assets/js/main.js`: theme toggle, mobile nav, scroll spy, reveal animations, project filters and the project modal
- `assets/cv/`: downloadable CV (PDF)
- `assets/images/`: profile photo, project screenshots and skill icons

## Run locally

Serve the folder with any static server, for example:

```bash
npx serve .
# or
python -m http.server 5173
```

## Updating content

- **New job:** add a `<li class="timeline-item">` to the `#experience` timeline.
- **New project:**
  1. Copy an `<article class="project">` block.
  2. Set its `data-category` (`fintech`, `civic`, `insurance`, `product` or `learning`) and its `data-*` modal fields.
  3. Add the screenshot to `assets/images/portfolio/`.
- **New CV:** replace `assets/cv/Olaniyi-Muiez-Kolawole-CV.pdf`.
