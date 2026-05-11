// Modal Logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (modalId === 'quiz-modal-1' && typeof initQuiz1 === 'function') initQuiz1();
        if (modalId === 'quiz-modal-2' && typeof initQuiz2 === 'function') initQuiz2();
        if (modalId === 'quiz-modal-3' && typeof initQuiz3 === 'function') initQuiz3();
        if (modalId === 'quiz-modal-4' && typeof initQuiz4 === 'function') initQuiz4();
        if (modalId === 'quiz-modal-5' && typeof initQuiz5 === 'function') initQuiz5();
        if (modalId === 'quiz-modal-6' && typeof initQuiz6 === 'function') initQuiz6();
        if (modalId === 'quiz-modal-7' && typeof initQuiz7 === 'function') initQuiz7();
        if (modalId === 'quiz-modal-8' && typeof initQuiz8 === 'function') initQuiz8();
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Reset quiz state when closing
        const options = modal.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.classList.remove('correct', 'wrong');
        });
        const feedback = modal.querySelector('.quiz-feedback');
        if (feedback) {
            feedback.innerHTML = '';
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});

// Quiz Logic
function checkAnswer(element, isCorrect, explanation) {
    const parent = element.closest('.quiz-options');
    // Prevent multiple clicks
    if (parent.classList.contains('answered')) return;
    
    parent.classList.add('answered');
    
    const feedback = element.closest('.modal').querySelector('.quiz-feedback');
    
    if (isCorrect) {
        element.classList.add('correct');
        if (feedback) {
            feedback.innerHTML = `<p style="color: var(--accent-green); margin-top: 1rem; font-weight: bold;">✅ 正确！${explanation}</p>`;
        }
    } else {
        element.classList.add('wrong');
        // Find correct answer and highlight it
        const options = parent.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            if (opt.getAttribute('data-correct') === 'true') {
                opt.classList.add('correct');
            }
        });
        if (feedback) {
            feedback.innerHTML = `<p style="color: var(--accent-pink); margin-top: 1rem; font-weight: bold;">❌ 错误。${explanation}</p>`;
        }
    }
}

// Interactive 3D adjustment for Chapter 3
function updateVolume() {
    const length = document.getElementById('ch3-length')?.value || 1;
    const width = document.getElementById('ch3-width')?.value || 1;
    const height = document.getElementById('ch3-height')?.value || 1;
    
    const vol = length * width * height;
    const sa = 2 * (length*width + length*height + width*height);
    
    const volSpan = document.getElementById('ch3-vol-result');
    const saSpan = document.getElementById('ch3-sa-result');
    
    if (volSpan) volSpan.textContent = vol;
    if (saSpan) saSpan.textContent = sa;

    const box = document.getElementById('ch3-box-visual');
    if (box) {
        // Update dimensions dynamically to avoid CSS border scaling
        const w = length * 20;
        const h = height * 20;
        const d = width * 20;
        
        box.style.width = w + 'px';
        box.style.height = h + 'px';
        
        const front = box.querySelector('.face.front');
        const back = box.querySelector('.face.back');
        const right = box.querySelector('.face.right');
        const left = box.querySelector('.face.left');
        const top = box.querySelector('.face.top');
        const bottom = box.querySelector('.face.bottom');

        if(front) front.style.transform = `translateZ(${d/2}px)`;
        if(back) back.style.transform = `rotateY(180deg) translateZ(${d/2}px)`;
        
        if(right) {
            right.style.width = d + 'px';
            right.style.marginLeft = -(d/2) + 'px';
            right.style.transform = `rotateY(90deg) translateZ(${w/2}px)`;
        }
        if(left) {
            left.style.width = d + 'px';
            left.style.marginLeft = -(d/2) + 'px';
            left.style.transform = `rotateY(-90deg) translateZ(${w/2}px)`;
        }
        
        if(top) {
            top.style.height = d + 'px';
            top.style.marginTop = -(d/2) + 'px';
            top.style.transform = `rotateX(90deg) translateZ(${h/2}px)`;
        }
        if(bottom) {
            bottom.style.height = d + 'px';
            bottom.style.marginTop = -(d/2) + 'px';
            bottom.style.transform = `rotateX(-90deg) translateZ(${h/2}px)`;
        }

        // Adjust container height dynamically so it grows with the demo
        const container = document.querySelector('.visual-box-container');
        if (container) {
            const maxDim = Math.max(w, h, d);
            container.style.height = (maxDim + 150) + 'px';
            container.style.transition = 'height 0.3s ease';
        }
    }
}

// ==========================================
// Chapter 1 Interactive Logic (m5b-ch01.html)
// ==========================================

let ch1Grid = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
];

function toggleBlock(cell) {
    const r = parseInt(cell.getAttribute('data-r'));
    const c = parseInt(cell.getAttribute('data-c'));
    
    // Cycle height from 0 -> 1 -> 2 -> 3 -> 0
    ch1Grid[r][c] = (ch1Grid[r][c] + 1) % 4;
    
    renderCh1Views();
}

function renderCh1Views() {
    const topGrid = document.getElementById('top-view-grid');
    const frontGrid = document.getElementById('front-view-grid');
    const leftGrid = document.getElementById('left-view-grid');
    
    if (!topGrid || !frontGrid || !leftGrid) return;
    
    // Render Top View
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const h = ch1Grid[r][c];
            const cell = topGrid.children[r * 3 + c];
            if (h > 0) {
                cell.className = 'cube-cell active active-top';
                cell.textContent = h;
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'white';
            } else {
                cell.className = 'cube-cell';
                cell.textContent = '';
            }
        }
    }
    
    // Render Front View (Max height of each column c)
    for (let c = 0; c < 3; c++) {
        const maxH = Math.max(ch1Grid[0][c], ch1Grid[1][c], ch1Grid[2][c]);
        for (let vr = 0; vr < 3; vr++) {
            const cell = frontGrid.children[vr * 3 + c];
            const requiredH = 3 - vr; 
            if (maxH >= requiredH) {
                cell.className = 'cube-cell active';
            } else {
                cell.className = 'cube-cell';
            }
        }
    }
    
    // Render Left View (Max height of each row r)
    for (let r = 0; r < 3; r++) {
        const maxH = Math.max(ch1Grid[r][0], ch1Grid[r][1], ch1Grid[r][2]);
        for (let vr = 0; vr < 3; vr++) {
            const cell = leftGrid.children[vr * 3 + r]; 
            const requiredH = 3 - vr;
            if (maxH >= requiredH) {
                cell.className = 'cube-cell active active-side';
            } else {
                cell.className = 'cube-cell';
            }
        }
    }

    // Render 3D Scene
    const scene = document.getElementById('ch1-3d-scene');
    if (scene) {
        scene.innerHTML = '';
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const h = ch1Grid[r][c];
                // Always render 3 levels (total 3x3x3 = 27 blocks)
                for (let level = 0; level < 3; level++) {
                    const isEmpty = level >= h;
                    const cube = document.createElement('div');
                    cube.className = 'cube-3d';
                    // x=c*30, y=-level*30 (up), z=r*30
                    cube.style.transform = `translate3D(${c * 30}px, ${-level * 30}px, ${r * 30}px)`;
                    
                    if (isEmpty) {
                        cube.innerHTML = `
                            <div class="cube-face front empty"></div>
                            <div class="cube-face back empty"></div>
                            <div class="cube-face right empty"></div>
                            <div class="cube-face left empty"></div>
                            <div class="cube-face top empty"></div>
                            <div class="cube-face bottom empty"></div>
                        `;
                    } else {
                        cube.innerHTML = `
                            <div class="cube-face front"></div>
                            <div class="cube-face back"></div>
                            <div class="cube-face right"></div>
                            <div class="cube-face left"></div>
                            <div class="cube-face top"></div>
                            <div class="cube-face bottom"></div>
                        `;
                    }
                    scene.appendChild(cube);
                }
            }
        }
    }
}

function toggleFront(cell) {
    const c = parseInt(cell.getAttribute('data-c'));
    const vr = parseInt(cell.getAttribute('data-vr'));
    const h = 3 - vr;
    
    const isActive = cell.classList.contains('active');
    if (!isActive) {
        // Turn ON: add to front row (r=2)
        if (ch1Grid[2][c] < h) {
            ch1Grid[2][c] = h;
        }
    } else {
        // Turn OFF: cap all rows in this column
        for (let r = 0; r < 3; r++) {
            if (ch1Grid[r][c] >= h) ch1Grid[r][c] = h - 1;
        }
    }
    renderCh1Views();
}

function toggleLeft(cell) {
    const r = parseInt(cell.getAttribute('data-r'));
    const vr = parseInt(cell.getAttribute('data-vr'));
    const h = 3 - vr;
    
    const isActive = cell.classList.contains('active-side');
    if (!isActive) {
        // Turn ON: add to left column (c=0)
        if (ch1Grid[r][0] < h) {
            ch1Grid[r][0] = h;
        }
    } else {
        // Turn OFF: cap all cols in this row
        for (let c = 0; c < 3; c++) {
            if (ch1Grid[r][c] >= h) ch1Grid[r][c] = h - 1;
        }
    }
    renderCh1Views();
}

// ==========================================
// Chapter 2 Interactive Logic (m5b-ch02.html)
// ==========================================

const factorData = {
    1: { factors: [1], type: '既不是质数也不是合数', color: 'var(--text-secondary)' },
    2: { factors: [1, 2], type: '质数 (最小的质数，也是唯一的偶质数)', color: 'var(--accent-green)' },
    3: { factors: [1, 3], type: '质数', color: 'var(--accent-green)' },
    4: { factors: [1, 2, 4], type: '合数 (最小的合数)', color: 'var(--accent-pink)' },
    5: { factors: [1, 5], type: '质数', color: 'var(--accent-green)' },
    6: { factors: [1, 2, 3, 6], type: '合数', color: 'var(--accent-pink)' },
    7: { factors: [1, 7], type: '质数', color: 'var(--accent-green)' },
    8: { factors: [1, 2, 4, 8], type: '合数', color: 'var(--accent-pink)' },
    9: { factors: [1, 3, 9], type: '合数 (最小的奇合数)', color: 'var(--accent-pink)' },
    10: { factors: [1, 2, 5, 10], type: '合数', color: 'var(--accent-pink)' },
    11: { factors: [1, 11], type: '质数', color: 'var(--accent-green)' },
    12: { factors: [1, 2, 3, 4, 6, 12], type: '合数', color: 'var(--accent-pink)' }
};

function showFactors(num) {
    const display = document.getElementById('factor-display');
    if (!display) return;
    
    const data = factorData[num];
    if (!data) return;

    // Highlight active box and factors
    document.querySelectorAll('#factor-grid .num-box').forEach(box => {
        box.classList.remove('active-num', 'factor-num');
        const boxNum = parseInt(box.getAttribute('data-num'));
        if (boxNum === num) {
            box.classList.add('active-num');
        } else if (data.factors.includes(boxNum)) {
            box.classList.add('factor-num');
        }
    });

    display.innerHTML = `
        <div>
            <h3 style="color: var(--accent-blue); margin-bottom: 0.5rem; font-size: 1.5rem;">数字 ${num}</h3>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>因数：</strong> ${data.factors.join(', ')}</p>
            <p style="font-size: 1.1rem;"><strong>属性：</strong> <span style="color: ${data.color}; font-weight: bold;">${data.type}</span></p>
        </div>
    `;
}

// ==========================================
// Dynamic Quiz Generators
// ==========================================

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initQuiz1() {
    const content = document.getElementById('quiz-content-1');
    const feedback = document.querySelector('#quiz-modal-1 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';
    
    const N = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const qText = `<p style="margin-top: 1rem;">如果从正面看是 ${N} 个并排的正方形（横着一排），从上面看也是 ${N} 个并排的正方形。那么搭成这个立体图形，最少需要几个小正方体？</p>`;
    
    let options = [
        { text: `${N}个`, correct: true, exp: `最少只需要${N}个小正方体排成一排，从正面和上面看都是${N}个。` },
        { text: `${N*2}个`, correct: false, exp: `注意看题目，只需要排成一排就能满足正面和上面都是${N}个哦。` },
        { text: `${N*N}个`, correct: false, exp: `这太多啦！想想怎么共用正方体。` }
    ];
    
    options = shuffle(options);
    
    let optionsHtml = `<div class="quiz-options">`;
    const labels = ['A', 'B', 'C'];
    options.forEach((opt, idx) => {
        optionsHtml += `
            <div class="quiz-option" data-correct="${opt.correct}" onclick="checkAnswer(this, ${opt.correct}, '${opt.exp}')">
                ${labels[idx]}. ${opt.text}
            </div>
        `;
    });
    optionsHtml += `</div>`;
    
    content.innerHTML = qText + optionsHtml;
}

function getDigitSum(num) {
    return num.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
}

function initQuiz2() {
    const content = document.getElementById('quiz-content-2');
    const feedback = document.querySelector('#quiz-modal-2 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';
    
    let correctNum = Math.floor(Math.random() * 90) + 10;
    while (correctNum % 3 !== 0) correctNum++;
    
    let wrongNum1 = Math.floor(Math.random() * 90) + 10;
    while (wrongNum1 % 3 === 0) wrongNum1++;
    
    let wrongNum2 = Math.floor(Math.random() * 90) + 10;
    while (wrongNum2 % 3 === 0 || wrongNum2 === wrongNum1) wrongNum2++;
    
    const nums = [
        { val: correctNum, correct: true },
        { val: wrongNum1, correct: false },
        { val: wrongNum2, correct: false }
    ];
    
    let options = nums.map(n => {
        const sumStr = n.val.toString().split('').join('+');
        const sum = getDigitSum(n.val);
        if (n.correct) {
            return { text: `${n.val}`, correct: true, exp: `${sumStr}=${sum}，${sum}是3的倍数，正确！` };
        } else {
            return { text: `${n.val}`, correct: false, exp: `${sumStr}=${sum}，${sum}不是3的倍数。` };
        }
    });
    
    options = shuffle(options);
    
    const qText = `<p style="margin-top: 1rem;">下面哪个数字是 3 的倍数？（提示：各位数字相加法）</p>`;
    let optionsHtml = `<div class="quiz-options">`;
    const labels = ['A', 'B', 'C'];
    options.forEach((opt, idx) => {
        optionsHtml += `
            <div class="quiz-option" data-correct="${opt.correct}" onclick="checkAnswer(this, ${opt.correct}, '${opt.exp}')">
                ${labels[idx]}. ${opt.text}
            </div>
        `;
    });
    optionsHtml += `</div>`;
    
    content.innerHTML = qText + optionsHtml;
}

function initQuiz3() {
    const content = document.getElementById('quiz-content-3');
    const feedback = document.querySelector('#quiz-modal-3 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';
    
    const L = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const W = Math.floor(Math.random() * (L - 2)) + 2; // < L
    const H = Math.floor(Math.random() * 4) + 2; // 2 to 5
    
    const A6 = 2 * (L*W + L*H + W*H);
    const A5 = L*W + 2*(L*H + W*H);
    const Vol = L*W*H;
    
    const qText = `<p style="margin-top: 1rem;">做一个长 ${L} 分米，宽 ${W} 分米，高 ${H} 分米的<strong>无盖</strong>木箱，至少需要多少平方分米的木板？</p>`;
    
    let options = [
        { text: `${A5} 平方分米`, correct: true, exp: `无盖说明只需要算5个面：底面+前后左右四个面。${L}×${W} + 2×(${L}×${H} + ${W}×${H}) = ${A5}` },
        { text: `${A6} 平方分米`, correct: false, exp: `这算出的是6个面的面积，题目说的是【无盖】哦！` },
        { text: `${Vol} 平方分米`, correct: false, exp: `这是体积公式！求木板大小应该算表面积。` }
    ];
    
    options = shuffle(options);
    
    let optionsHtml = `<div class="quiz-options">`;
    const labels = ['A', 'B', 'C'];
    options.forEach((opt, idx) => {
        optionsHtml += `
            <div class="quiz-option" data-correct="${opt.correct}" onclick="checkAnswer(this, ${opt.correct}, '${opt.exp}')">
                ${labels[idx]}. ${opt.text}
            </div>
        `;
    });
    optionsHtml += `</div>`;
    
    content.innerHTML = qText + optionsHtml;
}

// ==========================================
// Chapter 4 Interactive Logic (m5b-ch04.html)
// ==========================================

function updateFraction() {
    const numerEl = document.getElementById('ch4-numer');
    const denomEl = document.getElementById('ch4-denom');
    if (!numerEl || !denomEl) return;

    const numer = parseInt(numerEl.value);
    const denom = parseInt(denomEl.value);

    document.getElementById('val-numer').textContent = numer;
    document.getElementById('val-denom').textContent = denom;

    // Draw fraction bar
    const bar = document.getElementById('ch4-bar');
    if (bar) {
        bar.innerHTML = '';
        for (let i = 0; i < denom; i++) {
            const part = document.createElement('div');
            part.className = 'fraction-part ' + (i < numer ? 'filled' : 'empty');
            part.style.width = (100 / denom) + '%';
            bar.appendChild(part);
        }
    }

    // Update fraction display
    const fracText = document.getElementById('ch4-fraction-text');
    if (fracText) {
        fracText.innerHTML = `<span class="frac-top">${numer}</span><span class="frac-line">/</span><span class="frac-bottom">${denom}</span>`;
    }

    // Show equivalence info
    const equiv = document.getElementById('ch4-equiv');
    if (equiv) {
        const g = gcd(numer, denom);
        const sn = numer / g, sd = denom / g;
        let info = '';
        if (numer < denom) {
            info += `<span style="color:var(--accent-green)">✓ 真分数</span>（小于1）`;
        } else if (numer === denom) {
            info += `<span style="color:var(--accent-blue)">= 1</span>`;
        } else {
            const whole = Math.floor(numer / denom);
            const rem = numer % denom;
            info += `<span style="color:var(--accent-pink)">假分数</span> = ${whole}${rem > 0 ? ' ' + rem + '/' + denom : ''}`;
        }
        if (g > 1) {
            info += `<br>约分：${numer}/${denom} = <strong style="color:var(--accent-green)">${sn}/${sd}</strong>（÷${g}）`;
        } else {
            info += `<br><span style="color:var(--accent-green)">已是最简分数</span>`;
        }
        info += `<br>小数：≈ ${(numer / denom).toFixed(3)}`;
        equiv.innerHTML = info;
    }
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }

function initQuiz4() {
    const content = document.getElementById('quiz-content-4');
    const feedback = document.querySelector('#quiz-modal-4 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';

    // Generate a fraction to simplify
    const g = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    const sn = Math.floor(Math.random() * 5) + 1;
    const sd = Math.floor(Math.random() * 5) + sn + 1;
    const n = sn * g, d = sd * g;

    const qText = `<p style="margin-top: 1rem;">把 ${n}/${d} 约分成最简分数是？</p>`;
    let options = [
        { text: `${sn}/${sd}`, correct: true, exp: `${n}和${d}的最大公因数是${g}，同时÷${g}得到${sn}/${sd}。` },
        { text: `${n/2}/${d/2}`, correct: false, exp: `还没有约到最简哦！继续找公因数。` },
        { text: `${sn+1}/${sd+1}`, correct: false, exp: `约分是分子分母同时除以公因数，不是减去相同的数。` }
    ];
    options = shuffle(options);
    let html = qText + renderQuizOptions(options);
    content.innerHTML = html;
}

// ==========================================
// Chapter 5 Interactive Logic (m5b-ch05.html)
// ==========================================

// Clock positions: hour -> degrees from 12 o'clock (clockwise)
const clockPositions = {
    '12': 0, '1': 30, '2': 60, '3': 90, '4': 120,
    '5': 150, '6': 180, '7': 210, '8': 240, '9': 270,
    '10': 300, '11': 330
};

// Draw clock tick marks and numbers on load
(function initClockFace() {
    const ticks = document.getElementById('ch5-ticks');
    if (!ticks) return;
    const cx = 130, cy = 130, r = 105, tr = 90;
    for (let h = 1; h <= 12; h++) {
        const angleDeg = h * 30 - 90; // -90 so 12 is at top
        const angleRad = angleDeg * Math.PI / 180;
        // Tick mark
        const x1 = cx + r * Math.cos(angleRad);
        const y1 = cy + r * Math.sin(angleRad);
        const x2 = cx + (r + 10) * Math.cos(angleRad);
        const y2 = cy + (r + 10) * Math.sin(angleRad);
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', x1); tick.setAttribute('y1', y1);
        tick.setAttribute('x2', x2); tick.setAttribute('y2', y2);
        tick.setAttribute('stroke', 'rgba(255,255,255,0.4)');
        tick.setAttribute('stroke-width', h % 3 === 0 ? '3' : '1');
        ticks.appendChild(tick);
        // Number
        const tx = cx + tr * Math.cos(angleRad);
        const ty = cy + tr * Math.sin(angleRad) + 5;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', tx); text.setAttribute('y', ty);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'rgba(255,255,255,0.6)');
        text.setAttribute('font-size', h % 3 === 0 ? '15' : '12');
        text.setAttribute('font-weight', h % 3 === 0 ? 'bold' : 'normal');
        text.textContent = h;
        ticks.appendChild(text);
    }
})();

let clockPrevDeg = 0; // track previous position for ghost hand

function setClock(target, btn) {
    const hand = document.getElementById('ch5-hand');
    const ghost = document.getElementById('ch5-ghost');
    const arc = document.getElementById('ch5-arc');
    const arcArrow = document.getElementById('ch5-arc-arrow');
    const angleLabel = document.getElementById('ch5-angle-label');
    const info = document.getElementById('ch5-info');
    if (!hand) return;

    document.querySelectorAll('.transform-btn').forEach(b => b.classList.remove('active-btn'));
    if (btn) btn.classList.add('active-btn');

    const cx = 130, cy = 130, handLen = 100;
    let startDeg, endDeg, rotAngle, fromLabel, toLabel;

    switch (target) {
        case '12':
            startDeg = 0; endDeg = 0; rotAngle = 0;
            fromLabel = '12'; toLabel = '12';
            break;
        case '1':
            startDeg = 0; endDeg = 30; rotAngle = 30;
            fromLabel = '12'; toLabel = '1';
            break;
        case '3':
            startDeg = 30; endDeg = 90; rotAngle = 60;
            fromLabel = '1'; toLabel = '3';
            break;
        case '6':
            startDeg = 90; endDeg = 180; rotAngle = 90;
            fromLabel = '3'; toLabel = '6';
            break;
        case '9':
            startDeg = 180; endDeg = 270; rotAngle = 90;
            fromLabel = '6'; toLabel = '9';
            break;
        case '12b':
            startDeg = 180; endDeg = 360; rotAngle = 180;
            fromLabel = '6'; toLabel = '12';
            break;
    }

    // Position ghost hand at start
    const ghostRad = (startDeg - 90) * Math.PI / 180;
    ghost.setAttribute('x2', cx + handLen * Math.cos(ghostRad));
    ghost.setAttribute('y2', cy + handLen * Math.sin(ghostRad));
    ghost.setAttribute('stroke', rotAngle === 0 ? 'transparent' : 'rgba(255,255,255,0.15)');

    // Rotate the active hand
    hand.style.transform = `rotate(${endDeg}deg)`;

    // Draw arc
    if (rotAngle > 0) {
        const arcR = 45;
        const arcPath = describeArc(cx, cy, arcR, startDeg - 90, endDeg - 90);
        arc.setAttribute('d', arcPath);

        // Arrow at end of arc
        const arrowAngleRad = (endDeg - 90 - 5) * Math.PI / 180;
        const arrowEndRad = (endDeg - 90) * Math.PI / 180;
        const ax = cx + arcR * Math.cos(arrowEndRad);
        const ay = cy + arcR * Math.sin(arrowEndRad);
        const a1x = cx + (arcR - 6) * Math.cos(arrowAngleRad);
        const a1y = cy + (arcR - 6) * Math.sin(arrowAngleRad);
        const a2x = cx + (arcR + 6) * Math.cos(arrowAngleRad);
        const a2y = cy + (arcR + 6) * Math.sin(arrowAngleRad);
        arcArrow.setAttribute('points', `${ax},${ay} ${a1x},${a1y} ${a2x},${a2y}`);

        // Angle label
        const midAngle = ((startDeg + endDeg) / 2 - 90) * Math.PI / 180;
        const lx = cx + (arcR - 18) * Math.cos(midAngle);
        const ly = cy + (arcR - 18) * Math.sin(midAngle) + 5;
        angleLabel.setAttribute('x', lx);
        angleLabel.setAttribute('y', ly);
        angleLabel.textContent = rotAngle + '°';
        angleLabel.setAttribute('opacity', '1');
    } else {
        arc.setAttribute('d', '');
        arcArrow.setAttribute('points', '');
        angleLabel.setAttribute('opacity', '0');
    }

    // Info text
    if (info) {
        if (rotAngle === 0) {
            info.innerHTML = `指针指向 <strong>12</strong>，这是起始位置。<br>点击上方按钮，观察指针绕中心点 <span style="color:var(--accent-pink)">O</span> 顺时针旋转！`;
        } else {
            info.innerHTML = `从"<strong>${fromLabel}</strong>"到"<strong>${toLabel}</strong>"，指针绕点 <span style="color:var(--accent-pink)">O</span> 按<span style="color:var(--accent-green)">顺时针</span>方向旋转了 <strong style="color:var(--accent-green)">${rotAngle}°</strong>。<br>
            <span style="color:var(--text-secondary)">旋转中心：O 　旋转方向：顺时针 　旋转角度：${rotAngle}°</span>`;
        }
    }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function initQuiz5() {
    const content = document.getElementById('quiz-content-5');
    const feedback = document.querySelector('#quiz-modal-5 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';

    const shapes = ['正方形', '等边三角形', '正六边形'];
    const angles = [90, 120, 60];
    const idx = Math.floor(Math.random() * 3);
    const shape = shapes[idx];
    const angle = angles[idx];
    const wrongAngles = [45, 180, 150, 30, 72].filter(a => a !== angle);

    const qText = `<p style="margin-top: 1rem;">${shape}绕中心旋转多少度后能与自身完全重合？</p>`;
    let options = [
        { text: `${angle}°`, correct: true, exp: `${shape}旋转${angle}°后与自身重合，因为它有${360/angle}重旋转对称性。` },
        { text: `${wrongAngles[0]}°`, correct: false, exp: `${wrongAngles[0]}°旋转后不能与${shape}自身完全重合。` },
        { text: `${wrongAngles[1]}°`, correct: false, exp: `这个角度不对哦，想想${shape}有几条对称轴。` }
    ];
    options = shuffle(options);
    content.innerHTML = qText + renderQuizOptions(options);
}

// ==========================================
// Chapter 6 Interactive Logic (m5b-ch06.html)
// ==========================================

let ch6Op = '+';

function setOp(op) {
    ch6Op = op;
    const addBtn = document.getElementById('op-add-btn');
    const subBtn = document.getElementById('op-sub-btn');
    const display = document.getElementById('ch6-op-display');
    if (addBtn && subBtn) {
        addBtn.classList.toggle('active-op', op === '+');
        subBtn.classList.toggle('active-op', op === '-');
    }
    if (display) display.textContent = op === '+' ? '＋' : 'ー';
    calcFraction();
}

function calcFraction() {
    const n1 = parseInt(document.getElementById('ch6-n1')?.value) || 1;
    const d1 = parseInt(document.getElementById('ch6-d1')?.value) || 1;
    const n2 = parseInt(document.getElementById('ch6-n2')?.value) || 1;
    const d2 = parseInt(document.getElementById('ch6-d2')?.value) || 1;
    const vis = document.getElementById('ch6-steps-visual');
    if (!vis) return;

    const opSymbol = ch6Op === '+' ? '＋' : 'ー';
    const commonD = lcm(d1, d2);
    const newN1 = n1 * (commonD / d1);
    const newN2 = n2 * (commonD / d2);
    const resN = ch6Op === '+' ? newN1 + newN2 : newN1 - newN2;
    const g = gcd(Math.abs(resN), commonD);
    const finalN = resN / g, finalD = commonD / g;

    function F(n, d, cls) {
        cls = cls || '';
        return `<span class="frac ${cls}"><span class="frac-n">${n}</span><span class="frac-bar"></span><span class="frac-d">${d}</span></span>`;
    }

    let html = '';

    // Step 1: 通分 (only if denominators differ)
    if (d1 !== d2) {
        html += `<div class="step-section">`;
        html += `<div class="step-row"><span class="step-label">① 通分</span><span style="color:var(--text-secondary);font-size:0.85rem;">公分母 = lcm(${d1}, ${d2}) = ${commonD}</span></div>`;
        html += `<div class="step-row">`;
        html += F(n1, d1) + `<span class="step-eq">=</span>` + F(newN1, commonD, 'result-frac') + `<span style="margin:0 0.8rem;color:var(--text-secondary)">，</span>`;
        html += F(n2, d2) + `<span class="step-eq">=</span>` + F(newN2, commonD, 'result-frac');
        html += `</div></div>`;
    } else {
        html += `<div class="step-section">`;
        html += `<div class="step-row"><span class="step-label">① 同分母</span><span style="color:var(--text-secondary);font-size:0.85rem;">分母都是 ${d1}，直接计算</span></div>`;
        html += `</div>`;
    }

    // Step 2: 计算
    html += `<div class="step-section" style="margin-top:0.5rem;">`;
    html += `<div class="step-row"><span class="step-label">② 计算</span></div>`;
    html += `<div class="step-row">`;
    html += F(newN1, commonD) + `<span class="calc-op" style="font-size:1.2rem;">${opSymbol}</span>` + F(newN2, commonD);
    html += `<span class="step-eq">=</span>` + F(resN, commonD);
    html += `</div></div>`;

    // Step 3: 化简 / 结果
    html += `<div class="step-section" style="margin-top:0.5rem;">`;
    if (g > 1) {
        html += `<div class="step-row"><span class="step-label">③ 约分</span><span style="color:var(--text-secondary);font-size:0.85rem;">÷ ${g}</span></div>`;
        html += `<div class="step-row">`;
        html += F(resN, commonD) + `<span class="step-eq">=</span>`;
        if (finalD === 1) {
            html += `<span class="result-frac" style="font-size:1.5rem;">${finalN}</span>`;
        } else {
            html += F(finalN, finalD, 'result-frac');
        }
        html += `</div>`;
    } else {
        html += `<div class="step-row"><span class="step-label">③ 结果</span></div>`;
        html += `<div class="step-row">`;
        if (finalD === 1) {
            html += `<span class="result-frac" style="font-size:1.5rem;">${finalN}</span>`;
        } else {
            html += F(finalN, finalD, 'result-frac');
        }
        html += `<span style="color:var(--accent-green);margin-left:0.5rem;">✓ 已是最简分数</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    vis.innerHTML = html;
}

function initQuiz6() {
    const content = document.getElementById('quiz-content-6');
    const feedback = document.querySelector('#quiz-modal-6 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';

    const denoms = [[3,4], [4,5], [3,5], [2,3], [4,6], [3,8]];
    const [d1, d2] = denoms[Math.floor(Math.random() * denoms.length)];
    const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    const cd = lcm(d1, d2);
    const nn1 = n1 * (cd / d1), nn2 = n2 * (cd / d2);
    const rn = nn1 + nn2;
    const g2 = gcd(rn, cd);
    const fn = rn / g2, fd = cd / g2;

    const qText = `<p style="margin-top: 1rem;">${n1}/${d1} + ${n2}/${d2} = ？</p>`;
    let options = [
        { text: fd === 1 ? `${fn}` : `${fn}/${fd}`, correct: true, exp: `通分后 ${nn1}/${cd} + ${nn2}/${cd} = ${rn}/${cd}${g2 > 1 ? '，约分得' + fn + '/' + fd : ''}。` },
        { text: `${n1+n2}/${d1+d2}`, correct: false, exp: `分数加法不能直接分子加分子、分母加分母！要先通分。` },
        { text: `${rn}/${cd}`, correct: false, exp: `计算正确但还需要约分成最简分数哦！` }
    ];
    // If the third option is the same as first, change it
    if (g2 === 1) options[2] = { text: `${n1+n2}/${d1}`, correct: false, exp: `这不是正确的通分结果。` };
    options = shuffle(options);
    content.innerHTML = qText + renderQuizOptions(options);
}

// ==========================================
// Chapter 7 Interactive Logic (m5b-ch07.html)
// ==========================================

const chartDataSets = {
    temp: {
        labels: ['周一','周二','周三','周四','周五','周六','周日'],
        single: [{ name: '气温(°C)', data: [18,22,25,20,23,28,26], color: '#3b82f6' }],
        dual: [
            { name: '最高温(°C)', data: [18,22,25,20,23,28,26], color: '#3b82f6' },
            { name: '最低温(°C)', data: [8,12,14,10,13,17,15], color: '#ec4899' }
        ]
    },
    sales: {
        labels: ['1月','2月','3月','4月','5月','6月'],
        single: [{ name: '销量(件)', data: [120,95,140,180,210,175], color: '#10b981' }],
        dual: [
            { name: '甲店', data: [120,95,140,180,210,175], color: '#3b82f6' },
            { name: '乙店', data: [90,110,105,160,150,200], color: '#ec4899' }
        ]
    }
};

let currentChartType = 'temp';

function switchDataset(type, btn) {
    currentChartType = type;
    document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active-chart'));
    if (btn) btn.classList.add('active-chart');
    renderChart();
}

function toggleDual() {
    renderChart();
}

function renderChart() {
    const svg = document.getElementById('ch7-chart');
    const legend = document.getElementById('ch7-legend');
    if (!svg) return;

    const isDual = document.getElementById('ch7-dual-toggle')?.checked || false;
    const ds = chartDataSets[currentChartType];
    const labels = ds.labels;
    const datasets = isDual ? ds.dual : ds.single;

    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const w = 400 - padding.left - padding.right;
    const h = 250 - padding.top - padding.bottom;

    let allVals = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allVals);
    const minVal = 0;
    const range = maxVal - minVal || 1;

    let svgHtml = '';
    // Grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + h - (i / 5) * h;
        const val = Math.round(minVal + (i / 5) * range);
        svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${padding.left + w}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
        svgHtml += `<text x="${padding.left - 5}" y="${y + 4}" fill="rgba(255,255,255,0.4)" text-anchor="end" font-size="10">${val}</text>`;
    }

    // X labels
    const labelCount = labels.length;
    for (let i = 0; i < labelCount; i++) {
        const x = padding.left + (i / (labelCount - 1)) * w;
        svgHtml += `<text x="${x}" y="${padding.top + h + 20}" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-size="10">${labels[i]}</text>`;
    }

    // Draw lines
    datasets.forEach(d => {
        let polyline = '';
        let circles = '';
        for (let i = 0; i < d.data.length; i++) {
            const x = padding.left + (i / (labelCount - 1)) * w;
            const y = padding.top + h - ((d.data[i] - minVal) / range) * h;
            polyline += `${x},${y} `;
            circles += `<circle cx="${x}" cy="${y}" r="4" fill="${d.color}" stroke="white" stroke-width="1.5"/>`;
            circles += `<text x="${x}" y="${y - 10}" fill="${d.color}" text-anchor="middle" font-size="10" font-weight="bold">${d.data[i]}</text>`;
        }
        svgHtml += `<polyline points="${polyline}" fill="none" stroke="${d.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
        svgHtml += circles;
    });

    svg.innerHTML = svgHtml;

    // Legend
    if (legend) {
        legend.innerHTML = datasets.map(d =>
            `<div class="legend-item"><div class="legend-dot" style="background:${d.color}"></div>${d.name}</div>`
        ).join('');
    }
}

// Keep backward compatibility
function switchChart(type, btn) { switchDataset(type, btn); }

function initQuiz7() {
    const content = document.getElementById('quiz-content-7');
    const feedback = document.querySelector('#quiz-modal-7 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';

    const types = [
        { q: '要比较两个城市全年气温的变化趋势', a: '复式折线统计图', wrong: ['条形统计图', '扇形统计图'] },
        { q: '要统计某班同学的身高分布情况', a: '条形统计图', wrong: ['折线统计图', '复式折线统计图'] },
        { q: '要表示一周内每天最高温度的变化', a: '折线统计图', wrong: ['条形统计图', '扇形统计图'] }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];

    const qText = `<p style="margin-top: 1rem;">${chosen.q}，应该选用什么统计图最合适？</p>`;
    let options = [
        { text: chosen.a, correct: true, exp: `正确！${chosen.a}最适合这种情况。` },
        { text: chosen.wrong[0], correct: false, exp: `${chosen.wrong[0]}不太适合这个场景哦。` },
        { text: chosen.wrong[1], correct: false, exp: `${chosen.wrong[1]}在这里不是最佳选择。` }
    ];
    options = shuffle(options);
    content.innerHTML = qText + renderQuizOptions(options);
}

// ==========================================
// Chapter 8 Interactive Logic (m5b-ch08.html)
// ==========================================

let balanceState = { defect: 0, count: 0, balls: [], found: false };

function resetBalance() {
    balanceState.defect = Math.floor(Math.random() * 9);
    balanceState.count = 0;
    balanceState.found = false;
    balanceState.balls = Array(9).fill('none'); // 'none', 'left', 'right'

    const pool = document.getElementById('ch8-pool');
    if (pool) {
        pool.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const ball = document.createElement('div');
            ball.className = 'item-ball';
            ball.textContent = i + 1;
            ball.setAttribute('data-idx', i);
            ball.onclick = function() { toggleBall(i); };
            pool.appendChild(ball);
        }
    }

    document.getElementById('ch8-count').textContent = '0';
    document.getElementById('ch8-log').innerHTML = '🎯 游戏开始！9个球中有1个次品（比较轻），用天平找出它。试试最少2次找到！';
    resetBeam();
}

function toggleBall(idx) {
    if (balanceState.found) return;
    const states = ['none', 'left', 'right'];
    const current = states.indexOf(balanceState.balls[idx]);
    balanceState.balls[idx] = states[(current + 1) % 3];

    const ball = document.querySelector(`.item-ball[data-idx="${idx}"]`);
    if (ball) {
        ball.className = 'item-ball';
        if (balanceState.balls[idx] === 'left') ball.classList.add('on-left');
        if (balanceState.balls[idx] === 'right') ball.classList.add('on-right');
    }
}

function weighBalls() {
    if (balanceState.found) return;

    const leftBalls = [], rightBalls = [];
    balanceState.balls.forEach((state, idx) => {
        if (state === 'left') leftBalls.push(idx);
        if (state === 'right') rightBalls.push(idx);
    });

    if (leftBalls.length === 0 || rightBalls.length === 0) {
        document.getElementById('ch8-log').innerHTML += '<br>⚠️ 两边都需要放球才能称量！';
        return;
    }
    if (leftBalls.length !== rightBalls.length) {
        document.getElementById('ch8-log').innerHTML += '<br>⚠️ 两边放的球数量必须相同！';
        return;
    }

    balanceState.count++;
    document.getElementById('ch8-count').textContent = balanceState.count;

    const defectOnLeft = leftBalls.includes(balanceState.defect);
    const defectOnRight = rightBalls.includes(balanceState.defect);

    let resultMsg = '';
    if (!defectOnLeft && !defectOnRight) {
        resultMsg = '⚖️ 天平平衡！次品不在天平上，在没放上来的球中。';
        resetBeam();
    } else if (defectOnLeft) {
        resultMsg = '⬆️ 左盘翘起来了（左轻）！次品在左盘中。';
        tiltBeam('left-light');
    } else {
        resultMsg = '⬆️ 右盘翘起来了（右轻）！次品在右盘中。';
        tiltBeam('right-light');
    }

    const log = document.getElementById('ch8-log');
    log.innerHTML += `<br><strong>第${balanceState.count}次：</strong>左[${leftBalls.map(i=>i+1).join(',')}] vs 右[${rightBalls.map(i=>i+1).join(',')}] → ${resultMsg}`;

    // Check if only one ball remains as candidate
    if (leftBalls.length === 1 && rightBalls.length === 1) {
        if (defectOnLeft) {
            revealDefect(leftBalls[0]);
        } else if (defectOnRight) {
            revealDefect(rightBalls[0]);
        }
    }
}

function revealDefect(idx) {
    balanceState.found = true;
    const ball = document.querySelector(`.item-ball[data-idx="${idx}"]`);
    if (ball) ball.classList.add('found-defect');
    const log = document.getElementById('ch8-log');
    let rating = balanceState.count <= 2 ? '🌟 太棒了！最优解！' : (balanceState.count <= 3 ? '👍 不错！' : '💪 试试能否再少几次？');
    log.innerHTML += `<br><br>🎉 <strong>找到了！球 ${idx + 1} 是次品！</strong>用了 ${balanceState.count} 次称量。${rating}`;
}

function resetBeam() {
    const beam = document.getElementById('ch8-beam');
    const leftPan = document.getElementById('ch8-left-pan');
    const rightPan = document.getElementById('ch8-right-pan');
    if (beam) beam.setAttribute('points', '30,95 150,95 270,95');
    if (leftPan) leftPan.setAttribute('y', '90');
    if (rightPan) rightPan.setAttribute('y', '90');
}

function tiltBeam(direction) {
    const beam = document.getElementById('ch8-beam');
    const leftPan = document.getElementById('ch8-left-pan');
    const rightPan = document.getElementById('ch8-right-pan');
    if (direction === 'left-light') {
        if (beam) beam.setAttribute('points', '30,80 150,95 270,110');
        if (leftPan) leftPan.setAttribute('y', '75');
        if (rightPan) rightPan.setAttribute('y', '105');
    } else {
        if (beam) beam.setAttribute('points', '30,110 150,95 270,80');
        if (leftPan) leftPan.setAttribute('y', '105');
        if (rightPan) rightPan.setAttribute('y', '75');
    }
}

function initQuiz8() {
    const content = document.getElementById('quiz-content-8');
    const feedback = document.querySelector('#quiz-modal-8 .quiz-feedback');
    if (!content) return;
    if (feedback) feedback.innerHTML = '';

    const scenarios = [
        { n: 9, ans: 2 }, { n: 27, ans: 3 }, { n: 8, ans: 2 }, { n: 3, ans: 1 }
    ];
    const s = scenarios[Math.floor(Math.random() * scenarios.length)];
    const wrongAnswers = [s.ans + 1, s.ans + 2].filter(a => a !== s.ans);

    const qText = `<p style="margin-top: 1rem;">有 ${s.n} 个外观相同的球，其中1个是次品（偏轻），用天平称量，最少需要几次才能保证找到次品？</p>`;
    let options = [
        { text: `${s.ans}次`, correct: true, exp: `${s.n}个物品，每次分3组，3的${s.ans}次方=${Math.pow(3,s.ans)}≥${s.n}，所以最少${s.ans}次。` },
        { text: `${wrongAnswers[0]}次`, correct: false, exp: `可以更少哦！记住每次分3组的策略。` },
        { text: `${wrongAnswers[1]}次`, correct: false, exp: `太多了！用分3组的策略可以更高效。` }
    ];
    options = shuffle(options);
    content.innerHTML = qText + renderQuizOptions(options);
}

// ==========================================
// Shared Quiz Rendering Helper
// ==========================================

function renderQuizOptions(options) {
    const labels = ['A', 'B', 'C'];
    let html = `<div class="quiz-options">`;
    options.forEach((opt, idx) => {
        html += `
            <div class="quiz-option" data-correct="${opt.correct}" onclick="checkAnswer(this, ${opt.correct}, '${opt.exp.replace(/'/g, "\\'")}')">
                ${labels[idx]}. ${opt.text}
            </div>
        `;
    });
    html += `</div>`;
    return html;
}
