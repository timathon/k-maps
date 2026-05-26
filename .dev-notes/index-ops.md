# index-ops.md
## Developer Notes for Directory and Root Index Management

This document compiles the patterns, structures, and guidelines for managing chapter directory indexes and synchronizing them with the root `index.html` file.

---

### 1. Chapter Directory Index Layout & Wording
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

---

### 2. Root Index File Accordion Tree Sync
When a new strategy chapter folder or strategy file is created, it must be integrated into the accordion tree structure of `/index.html`:
- **Folder and File Nodes**: Add nesting structure corresponding to levels:
  - Level 3: Chapter folder (`id="node-m7b-chX"`), node name `m7b-chX`
  - Level 4: Strategies folder (`id="node-m7b-chX-strategies"`), node name `m7b-chX-strategies`
  - Level 5: File item (`class="tree-node file"`), with data-title, node-link, file-name, file-title, and a `badge-strategy` badge.
  
  Example structure:
  ```html
  <!-- Level 3: m7b-ch4 -->
  <div class="tree-node folder open" id="node-m7b-ch4">
      <div class="node-header" onclick="toggleNode('node-m7b-ch4')">
          <svg class="caret" viewBox="0 0 24 24"><path d="..."/></svg>
          <svg class="icon folder-icon" viewBox="0 0 24 24"><path d="..."/></svg>
          <span class="node-name">m7b-ch4</span>
      </div>
      <div class="node-children">
          <!-- Level 4: m7b-ch4-strategies -->
          <div class="tree-node folder open" id="node-m7b-ch4-strategies">
              <div class="node-header" onclick="toggleNode('node-m7b-ch4-strategies')">
                  <svg class="caret" viewBox="0 0 24 24"><path d="..."/></svg>
                  <svg class="icon folder-icon" viewBox="0 0 24 24"><path d="..."/></svg>
                  <span class="node-name">m7b-ch4-strategies</span>
              </div>
              <div class="node-children">
                  <!-- Level 5: file-link -->
                  <div class="tree-node file" data-title="动态几何策略训练 - 双动点与全等分类讨论">
                      <a href="math/m7b/m7b-ch4/m7b-ch4-strategies/m7b-ch4-strategies-1.html" class="node-link">
                          <svg class="icon file-icon" viewBox="0 0 24 24"><path d="..."/></svg>
                          <span class="file-info">
                              <span class="file-name">m7b-ch4-strategies-1.html</span>
                              <span class="file-title">动态几何策略训练 - 双动点与全等分类讨论</span>
                          </span>
                          <span class="badge badge-strategy">Strategy</span>
                      </a>
                  </div>
              </div>
          </div>
      </div>
  </div>
  ```

---

### 3. Global Statistics and Reset Handlers Synchronization
Adding a new file requires updating global elements and scripts in `/index.html`:
- **HTML Total Count**: Update the total files statistic counts:
  - `<span class="stat-val" id="stat-total-files">[Count]</span>`
  - `<span id="results-count" class="results-info">共 [Count] 个 HTML 页面</span>`
- **Class / Category Count**: Increment category counts (e.g. `stat-strategies` and the legend item `Strategy` count) to accurately reflect the actual number of files.
- **Search Reset Script**: Expand the `resetSearch()` JavaScript function to include the newly added folders so they expand and stay open when search filters are cleared:
  ```javascript
  document.getElementById('node-m7b-chX').classList.add('open');
  document.getElementById('node-m7b-chX-strategies').classList.add('open');
  resultsCountEl.textContent = "共 [Count] 个 HTML 页面";
  ```
