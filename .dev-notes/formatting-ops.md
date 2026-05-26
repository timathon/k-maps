# strategy-html-formatting-ops.md
## Developer Notes for Strategy & Quiz HTML Formatting

This document compiles the design patterns, layout choices, and UX solutions implemented in `m7b-ch5-strategies-1.html` so we can quickly apply them to similar strategy quiz files in the future.

---

### 1. Floating & Responsive Back Link (Home Emoji)
To keep a clean layout where the back button aligns nicely on both desktop and mobile views:
- **Desktop**: Place it absolutely inside a `relative` container on the left of `h1`.
- **Mobile**: Push it up above the `h1` element so it doesn't collide with the text or create empty white space.

```html
<div class="text-center space-y-2 relative">
    <a href="../../../../../index.html" 
       class="absolute -top-10 left-0 md:top-0 md:left-4 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 text-lg opacity-50 hover:opacity-100 hover:bg-gray-50 hover:shadow transition-all hover:scale-105" 
       title="返回首页">
        🏠
    </a>
    <h1 class="text-3xl font-bold text-gray-900">...</h1>
</div>
```

---

### 2. MathJax Mobile Responsiveness (Preventing Horizontal Overflow)
MathJax-rendered equations often break layout flow and cause horizontal scrollbars on mobile. The following CSS overrides MathJax's styles by forcing containers to scroll horizontally and scale down slightly on narrow viewports:

```css
#explanation-content mjx-container,
#question-area mjx-container {
    display: inline-block !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    vertical-align: middle;
    -webkit-overflow-scrolling: touch;
}

#explanation-content mjx-container[display="true"],
#question-area mjx-container[display="true"] {
    display: block !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
}

@media (max-width: 600px) {
    #explanation-content mjx-container,
    #question-area mjx-container {
        font-size: 88% !important;
    }
}
```

---

### 3. Cumulative Layout Shift (CLS) Prevention
To prevent the container from jumping up and down when showing/hiding explanations or action buttons, avoid `display: none` or Tailwind `hidden` classes for state changes. Instead:
- **Pre-render** explanation containers in a neutral/placeholder state (e.g. gray border/text) and transition them when a user selects an answer.
- **Pre-render** next buttons as `disabled` and grey, and activate/style them after user interaction.

```html
<!-- Pre-rendered placeholder -->
<div id="explanation-box" class="rounded-xl bg-gray-50 border border-gray-100 p-5 mt-6 transition-all duration-300">
    ...
</div>
```

On answer selection, transition classes via JS:
```javascript
const expBox = document.getElementById('explanation-box');
expBox.classList.remove('bg-gray-50', 'border-gray-100');
expBox.classList.add('bg-blue-50', 'border-blue-100');
```

---

### 4. Option Shuffling on Each Load
To ensure active learning, choices must be randomly shuffled each time the question is rendered:
```javascript
// Shuffle options in place to randomize choices order
data.options.sort(() => Math.random() - 0.5);
```

---

### 5. Smart Mobile Scrolling
In mobile view, if the user interacts with an option but the quiz container is partially scrolled out of view, smoothly scroll it back to attach to the top of the viewport:
```javascript
if (window.innerWidth < 768) {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const rect = quizContainer.getBoundingClientRect();
        if (Math.abs(rect.top) > 5) {
            quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
```

---

### 6. Fine-grained UI Updates in Drag/Drop or Sorting Elements (No Refreshes)
To avoid annoying layout flashes and animations when adding/removing steps in an interactive challenge:
- Do **not** replace the outer HTML container (`innerHTML`).
- Create separate container nodes (`#selected-area-content`, `#available-area-content`) and update only their inner HTML during active manipulation.
- Save full re-renders (with CSS entry animations like `.fade-in`) strictly for the initial view setup.

```javascript
if (isInitial) {
    // Renders the overall layout structure and hooks up CSS entry animations
    container.innerHTML = `
        <div class="fade-in space-y-6">
            ...
            <div id="selected-area-content">${selectedHtml}</div>
            <div id="available-area-content">${availableHtml}</div>
        </div>
    `;
} else {
    // Silently swaps elements in place without resetting scroll, focus, or animation states
    document.getElementById('selected-area-content').innerHTML = selectedHtml;
    document.getElementById('available-area-content').innerHTML = availableHtml;
}
```

---

### 7. Initial MathJax Page Typesetting & Reference Safety
When configuring MathJax with `startup: { typeset: false }` for custom dynamic typesetting, static math formulas in the raw HTML (e.g. in original problem descriptions) will not render automatically. Also, if MathJax is slow to load, direct global references cause runtime `ReferenceError` crashes.

- **Initial Document Typeset**: Run a full document typesetting pass on window load before rendering the first quiz step.
- **Defensive API Checks**: Ensure `window.MathJax` and `window.MathJax.typesetPromise` are defined before executing any typeset commands.

```javascript
// Initialize on page load
window.onload = () => {
    setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().then(() => {
                renderStep();
            }).catch(function (err) {
                console.error('MathJax error: ', err.message);
                renderStep();
            });
        } else {
            renderStep();
        }
    }, 500);
};

// Safe typeset within dynamic rendering blocks
if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([container]).catch(function (err) {
        console.error('MathJax error: ', err.message);
    });
}
```

---

### 8. Unconditional Scrolling for Focus Preservation
To ensure that expanding explanation boxes or growing logic chains do not push active buttons (like "进入下一步" or "验证逻辑闭环") out of the visible screen on both desktop and mobile viewports:
- Trigger smooth scrolling to the top of the container unconditionally whenever a selection changes or a step is moved.
- Use a `Math.abs(rect.top) > 5` check to prevent jitter or unnecessary scrolling if the container is already perfectly aligned with the viewport top.

```javascript
// Triggered on option click or step selection
const container = document.getElementById('quiz-container');
if (container) {
    const rect = container.getBoundingClientRect();
    if (Math.abs(rect.top) > 5) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
```

---

### 9. Strategy Detail Modals & Event Isolation
To show students what a specific strategy refers to in the context of the current problem without breaking the sorting flow:
- **Event Isolation**: Use `event.stopPropagation()` on the help (`?`) icon click handler to prevent it from triggering the parent card's select/unselect movement handler.
- **MathJax Typesetting inside Modals**: MathJax must typeset the modal content dynamically upon opening the modal. Pass the modal body element to `MathJax.typesetPromise` to compile any LaTeX formulas within the strategy descriptions.
- **Backdrop & Animation**: Style the modal with a blur backdrop (`backdrop-blur-sm bg-slate-900/50` or `bg-gray-900/50`) and animate using Tailwind transition properties (`scale-95 opacity-0` to `scale-100 opacity-100`).

```html
<!-- Help icon button inside strategy card -->
<span onclick="event.stopPropagation(); showDetail(${step.id})" 
      class="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600 rounded-full font-bold transition-all text-sm cursor-pointer" 
      title="查看本题策略详情">?</span>
```

```javascript
function showModal(title, content) {
    const modal = document.getElementById('detail-modal');
    const mTitle = document.getElementById('modal-title');
    const mBody = document.getElementById('modal-body');

    mTitle.textContent = title;
    mBody.innerHTML = content;

    modal.classList.remove('hidden');
    // Animate wrapper entry here...

    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([mBody]).catch(err => console.error(err));
    }
}
```

---

### 10. Logic Chain Reset Button
To allow students to quickly restart sorting challenges from scratch:
- Render a themed "重置" (Reset) button aligned on the header of the "逻辑执行链" (Logic Chain) column.
- The button starts disabled and transitions into an active themed state (using the primary color of the page, e.g., Blue or Indigo) as soon as one or more items are added to the logic chain.
- Clicking the reset button shuffles the available items pool and clears the logic chain.

```javascript
// Update state dynamically on render
const resetBtn = document.getElementById('reset-challenge-btn');
if (resetBtn) {
    if (selectedSteps.length > 0) {
        resetBtn.disabled = false;
        resetBtn.className = "text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer";
    } else {
        resetBtn.disabled = true;
        resetBtn.className = "text-xs bg-slate-100 text-slate-400 border border-slate-200 font-semibold px-2.5 py-1 rounded-md transition-all cursor-not-allowed opacity-50";
    }
}
```

---

### 11. Difficulty Badge & Color Harmonization
To ensure consistent difficulty representation across problem pages and directory indices:
- **Problem Page**: Include a difficulty badge inside the header of the "原题呈现" container:
  ```html
  <span class="px-3 py-1 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">难度：★★★☆☆</span>
  ```
- **Directory Index Cards**: Match the difficulty of each card with difficulty-based color-coding in the tree-node or index panels:
  - **4-Star Difficulty**: Use amber-themed tags:
    ```html
    <span class="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md">难度：★★★★☆</span>
    ```
  - **3-Star Difficulty**: Use indigo-themed tags:
    ```html
    <span class="text-xs font-bold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2.5 py-1 rounded-md">难度：★★★☆☆</span>
    ```

---

### 12. Geometric Accuracy in SVGs (Collinearity & Segments)
To preserve the mathematical correctness and clarity of geometric diagrams:
- **Avoiding False Collinearity**: In dynamic geometry problems with moving points (e.g. $M$ and $N$), line segments connecting them through a midpoint (like $EM$ and $EN$) are only collinear in highly specific states.
- **Segment Representation**: Avoid drawing these as a single straight `<line x1="M_x" y1="M_y" x2="N_x" y2="N_y">`. Instead, draw them as two separate segments meeting at the common point:
  ```html
  <!-- EM segment -->
  <line x1="220" y1="40" x2="200" y2="100" />
  <!-- EN segment (offset to prevent straight line) -->
  <line x1="200" y1="100" x2="150" y2="160" />
  ```
- **Label Alignment**: When moving point coordinates in SVG, ensure that circle anchors (`cx`) and labels (`text x`) are offset consistently (e.g., placing the label 10px to the left of the circle anchor).
- **Core Connections**: Ensure all helper lines and connection segments described in the problem statement (e.g. connection line $BD$) are fully drawn.
