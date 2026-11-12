# index-ops.md
## Developer Notes for Directory and Root Index Management

This document compiles the patterns, structures, and guidelines for managing chapter directory indexes and synchronizing them with the root `index.html` file.

---

### 1. New HTML File Ingestion Checklist (Fast-Track)
When adding an external or newly generated interactive HTML page (e.g., from an AI visual prompt or external simulator):
1. **Filename Standardization**:
   - Follow category naming conventions:
     - Physics (Grade 8): `physics/p8a/p8a-[topic]-[subtopic].html` (e.g. `p8a-optics-refraction.html`, `p8a-optics-taillight.html`, `p8a-thermo-water.html`)
     - Math (Grade 7B Strategies): `math/m7b/m7b-chX/m7b-chX-strategies/m7b-chX-strategies-Y.html`
     - Math (Grade 5B Practice): `math/m5b/m5b-practices/[topic].html`
2. **Markdown Code Fence Stripping**:
   - External visual widgets often come enclosed in ````html ... ```` fences. Check line 1 and the last line and strip them immediately.
3. **Viewport & Container Width Constraints**:
   - Prevent widgets from stretching infinitely on wide desktop monitors (e.g. 1920px+). Ensure the main wrapper has:
     ```css
     max-width: 1080px !important;
     margin: 0 auto !important;
     ```
   - Ensure `body` allows vertical scrolling (`overflow-y: auto !important`).
4. **Header & Home Navigation**:
   - Provide a prominent **"返回主页"** button linking directly to the root `index.html`:
     - From `physics/p8a/`: `../../index.html` (2 levels)
     - From `math/m7b/m7b-chX/m7b-chX-strategies/`: `../../../../index.html` (4 levels)

---

### 2. Root Index Synchronization (`assets/js/tree-data.js`)
*Note: `index.html` uses modular JSON data (`COURSE_TREE_DATA` in `assets/js/tree-data.js`). Do NOT hardcode `<div class="tree-node file">` into `index.html`.*

To add a new file to the root tree:
1. Locate the appropriate folder node in `assets/js/tree-data.js`.
2. Append a clean JSON entry into its `children` array:
   ```javascript
   {
     "type": "file",
     "dataTitle": "[Full Chinese Search Title] - [Grade Subject]",
     "href": "[Relative path from root, e.g. physics/p8a/p8a-optics-refraction.html]",
     "name": "[filename.html]",
     "title": "[Short Chinese Title with topic model]",
     "badge": {
       "text": "Logic",          // "Map" | "Core" | "Logic" | "Exam" | "Strategy"
       "class": "badge-logic"     // "badge-map" | "badge-core" | "badge-logic" | "badge-exam" | "badge-strategy"
     }
   }
   ```
3. Update stats in `index.html` & cache busting tag:
   - Increment `stat-total-files` and `results-count` by 1.
   - Increment the corresponding badge count (e.g., `stat-logic-challenges` and `.legend-count` for `Logic`).
   - Bump script cache buster query parameter in `index.html` (`?v=3`) so browsers don't serve stale cached tree data.

---

### 3. Chapter Directory Index Layout & Wording
Each chapter directory (e.g., `math/m7b/m7b-ch4/m7b-ch4-strategies/`) contains an `index.html` file showing all strategy files available in that chapter.
- **Wording Convention**: Title, badge, and primary heading (`h1`) must explicitly state the grade, semester, and chapter.
  - Title: `七下数学第[X]章几何解题策略训练 - 资源目录`
  - Sub-badge: `SmartEDU K-Maps • 七下数学第[X]章`
  - Heading: `七下数学第[X]章几何压轴题解题策略训练`
- **Correct Back Link Level**: The floating home emoji button must point directly to the root `index.html`. Since strategy directories are exactly 4 levels deep, the link must be `../../../../index.html` (4 parent levels):
  ```html
  <a href="../../../../index.html" class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-lg hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all" title="返回主页">
      🏠
  </a>
  ```
  *(Note: Avoid using 5-level parent directory paths like `../../../../../index.html` which break navigation).*
