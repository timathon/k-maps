# Generate M5B Math Infographic

This plan details the creation of interactive, highly visual HTML infographics for the "Math Grade 5 Semester 2 (m5b)" textbook, designed specifically for beginner students preparing for exams.

## User Review Required

> [!IMPORTANT]
> - **Scope of Chapters:** The textbook has 8 chapters. The plan proposes creating the main index (`index.html`) which serves as a visually rich learning map, and fully implementing the first three chapters (`m5b-ch01.html`, `m5b-ch02.html`, `m5b-ch03.html`) to establish the template. The remaining chapters can be generated subsequently or simultaneously depending on your preference. Do you want all 8 chapters implemented immediately in one go?
> - **Styling:** I will use Vanilla CSS as per guidelines to ensure maximum flexibility and beautiful aesthetics (glassmorphism, vibrant colors, micro-animations) without relying on TailwindCSS.

## Open Questions

- Are there any specific brand colors or themes you want to apply, or should I use a vibrant, student-friendly palette (e.g., bright blues, greens, oranges with dark/light mode support)?

## Proposed Changes

### Overall Structure
We will create a centralized CSS file for the overall design system to ensure all pages share a premium, cohesive look.

#### [NEW] `math/m5b/assets/style.css`
Contains the design system:
- CSS variables for vibrant colors and gradients
- Glassmorphism utility classes
- Animation keyframes for micro-animations
- Modal styling and layout structures

#### [NEW] `math/m5b/assets/script.js`
Handles:
- Modal opening/closing logic
- Interactive quiz verification
- Dynamic SVGs or interactive components

### Main Index (Learning Map)

#### [MODIFY] `math/m5b/index.html`
An interactive "Learning Path" or "Subway Map" style infographic.
- Features: 8 nodes representing the 8 chapters of M5B.
- Each node will have a beautiful hover effect and a brief description of the chapter.
- Clicking a node links to the corresponding chapter page (e.g., `m5b-ch01.html`).

### Chapter Infographics

#### [NEW] `math/m5b/m5b-ch01.html` - 第一单元：观察物体（三） (Observe Objects)
- **Knowledge Points:** Understanding 3D shapes from different perspectives (front, top, left/right).
- **Interactive Element:** SVG-based 3D cubes that highlight different faces when hovered.
- **Guidance:** Step-by-step logic to deduce the original shape from 2D views.
- **Quick Quiz:** A modal presenting a 2D view and asking how many cubes could form it.

#### [NEW] `math/m5b/m5b-ch02.html` - 第二单元：因数与倍数 (Factors and Multiples)
- **Knowledge Points:** Prime vs. Composite, Factors and Multiples, rules for divisibility by 2, 3, and 5.
- **Formulas/Diagrams:** Venn diagrams for factors, dynamic highlighting of numbers.
- **Quick Quiz:** Modal to test prime factorization or divisibility rules.

#### [NEW] `math/m5b/m5b-ch03.html` - 第三单元：长方体和正方体 (Cuboids and Cubes)
- **Knowledge Points:** Surface area and volume formulas.
- **Diagrams:** Interactive 3D cuboid where users can adjust length, width, and height via sliders (using vanilla JS + CSS/SVG) to see the volume change.
- **Quick Quiz:** Calculate surface area given dimensions.

#### *(Following chapters 4-8 will follow the exact same high-quality pattern)*
- `m5b-ch04.html` - 分数的意义和性质
- `m5b-ch05.html` - 图形的运动（三）
- `m5b-ch06.html` - 分数的加法和减法
- `m5b-ch07.html` - 折线统计图
- `m5b-ch08.html` - 找次品

## Verification Plan

### Manual Verification
- Open `math/m5b/index.html` in the browser to verify the visual aesthetic (glassmorphism, modern fonts, animations).
- Click through to chapter 1, 2, and 3 to ensure links work.
- Test the interactive SVG elements in chapter 1.
- Open the Quick Quiz modals and verify the JavaScript validation logic works.
- Verify all text is in Chinese and easy for beginners to understand.
