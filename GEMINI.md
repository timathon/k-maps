# K-Maps Repository Rules

## New HTML File Checklist

Whenever a new HTML file is added to this repository, run through the developer operations in `.dev-notes/`:

1. **Formatting & UX Ops** (`.dev-notes/formatting-ops.md`):
   - Follow the standard layout, responsive home link, MathJax mobile responsiveness CSS, CLS prevention (pre-rendered explanation/next-button states), option shuffling, and smart mobile scrolling patterns.

2. **Index & Synchronization Ops** (`.dev-notes/index-ops.md`):
   - **Filename & Wrapper**: Follow category naming conventions, strip any markdown code fences, and constrain wide-screen container width (`max-width: 1080px`) with vertical scrolling enabled.
   - **Root Tree Data (`assets/js/tree-data.js`)**: Add the new HTML file entry under its corresponding folder node in `COURSE_TREE_DATA`.
   - **Root Index (`index.html`)**: Increment `stat-total-files`, `results-count`, the matching category stat/legend count, and bump the `assets/js/tree-data.js?v=...` cache-busting query parameter.
   - **Chapter Directory Index (`index.html`)**: Ensure the chapter's `index.html` exists, lists the new file, and uses the correct relative path back to the root `index.html` (e.g. `../../../../index.html` for 4-level deep strategy directories).
