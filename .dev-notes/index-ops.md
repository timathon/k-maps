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
When a new strategy chapter folder, practice folder, or file is created, it must be integrated into the accordion tree structure of `/index.html`:
- **Folder and File Nodes**: Add nesting structure corresponding to levels:
  - Level 3: Chapter folder (e.g., `id="node-m7b-chX"` or `id="node-m5b-practices"`), node name `m7b-chX` or `m5b-practices`
  - Level 4: Specific sub-folders (e.g., `id="node-m7b-chX-strategies"`), node name `m7b-chX-strategies`
  - Level 5 / File node: File item (`class="tree-node file"`), with data-title, node-link, file-name, file-title, and appropriate badge.
  
- **Badge Types & Classification**:
  - `badge-map`: Map (课程学习地图)
  - `badge-core`: Core (核心基础精讲 / 练习)
  - `badge-logic`: Logic (高阶思维逻辑)
  - `badge-exam`: Exam (综合评测复习)
  - `badge-strategy`: Strategy (压轴突破策略)

  Example structure for chapter folders/strategies:
  ```html
  <!-- Level 3: m7b-ch4 -->
  <div class="tree-node folder open" id="node-m7b-ch4">
      ...
  </div>
  ```

  Example structure for practice folders (e.g., `m5b-practices`):
  ```html
  <!-- Level 3: m5b-practices -->
  <div class="tree-node folder" id="node-m5b-practices">
      <div class="node-header" onclick="toggleNode('node-m5b-practices')">
          <svg class="caret" viewBox="0 0 24 24"><path d="..."/></svg>
          <svg class="icon folder-icon" viewBox="0 0 24 24"><path d="..."/></svg>
          <span class="node-name">m5b-practices</span>
      </div>
      <div class="node-children">
          <div class="tree-node file" data-title="分数加减混合运算简便计算练习题 - 五年级下册">
              <a href="math/m5b/m5b-practices/fraction-add-sub.html" class="node-link">
                  <svg class="icon file-icon" viewBox="0 0 24 24"><path d="..."/></svg>
                  <span class="file-info">
                      <span class="file-name">fraction-add-sub.html</span>
                      <span class="file-title">分数加减混合运算简便计算练习题</span>
                  </span>
                  <span class="badge badge-core">Core</span>
              </a>
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
- **Class / Category Count**: Increment the count for the category containing the new file:
  - Stats Cards (e.g., `stat-total-files`, `stat-logic-challenges`, `stat-strategies`)
  - Legend items (e.g., `Map`, `Core`, `Logic`, `Exam`, `Strategy` count)
- **Search Reset Script**: Expand the `resetSearch()` JavaScript function to include the newly added folders so they expand and stay open when search filters are cleared:
  ```javascript
  document.getElementById('node-m7b-chX').classList.add('open');
  document.getElementById('node-m7b-chX-strategies').classList.add('open');
  resultsCountEl.textContent = "共 [Count] 个 HTML 页面";
  ```
