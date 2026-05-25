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
