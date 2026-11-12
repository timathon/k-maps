// K-Maps App Logic

// Icons SVG definitions matching original index.html exactly
const ICONS = {
    caret: `<svg class="caret" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
    folder: `<svg class="icon folder-icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
    file: `<svg class="icon file-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`
};

// Render Tree DOM recursively
function renderTree(nodes, container) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    function createNode(node) {
        if (node.type === 'folder') {
            const folderDiv = document.createElement('div');
            folderDiv.className = `tree-node folder${node.open ? ' open' : ''}`;
            if (node.id) folderDiv.id = node.id;

            const headerDiv = document.createElement('div');
            headerDiv.className = 'node-header';
            headerDiv.innerHTML = `${ICONS.caret}${ICONS.folder}<span class="node-name">${node.name}</span>`;
            if (node.id) {
                headerDiv.setAttribute('onclick', `toggleNode('${node.id}')`);
            }

            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'node-children';
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    childrenDiv.appendChild(createNode(child));
                });
            }

            folderDiv.appendChild(headerDiv);
            folderDiv.appendChild(childrenDiv);
            return folderDiv;
        } else if (node.type === 'file') {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'tree-node file';
            if (node.dataTitle) fileDiv.setAttribute('data-title', node.dataTitle);

            const badgeCls = node.badge?.class || 'badge-logic';
            const badgeTxt = node.badge?.text || 'Logic';

            fileDiv.innerHTML = `
                <a href="${node.href}" class="node-link">
                    ${ICONS.file}
                    <span class="file-info">
                        <span class="file-name">${node.name}</span>
                        ${node.title ? `<span class="file-title">${node.title}</span>` : ''}
                    </span>
                    <span class="badge ${badgeCls}">${badgeTxt}</span>
                </a>
            `;
            return fileDiv;
        }
    }

    nodes.forEach(node => {
        fragment.appendChild(createNode(node));
    });

    container.appendChild(fragment);
}

// Toggle Accordion Tree Node (Open/Close)
function toggleNode(id) {
    const node = document.getElementById(id);
    if (node) {
        node.classList.toggle('open');
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    const treeRoot = document.getElementById('project-tree');
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    const resultsCountEl = document.getElementById('results-count');
    const noResultsEl = document.getElementById('no-results');

    // 1. Initial Tree Render
    if (typeof COURSE_TREE_DATA !== 'undefined' && treeRoot) {
        renderTree(COURSE_TREE_DATA, treeRoot);
    }

    const totalFiles = document.querySelectorAll('.tree-node.file').length;
    if (resultsCountEl) {
        resultsCountEl.textContent = `共 ${totalFiles} 个 HTML 页面`;
    }

    // 2. Expand All folders
    const expandBtn = document.getElementById('btn-expand-all');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const folders = document.querySelectorAll('.tree-node.folder');
            folders.forEach(f => f.classList.add('open'));
        });
    }

    // 3. Collapse All folders
    const collapseBtn = document.getElementById('btn-collapse-all');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            const folders = document.querySelectorAll('.tree-node.folder');
            folders.forEach(f => f.classList.remove('open'));
        });
    }

    // 4. Search Input Functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const val = this.value.trim().toLowerCase();
            if (val.length > 0) {
                if (clearBtn) clearBtn.style.display = 'block';
                performSearch(val);
            } else {
                if (clearBtn) clearBtn.style.display = 'none';
                resetSearch();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            clearBtn.style.display = 'none';
            resetSearch();
        });
    }

    // Perform search logic
    function performSearch(query) {
        let matchesCount = 0;
        const files = document.querySelectorAll('.tree-node.file');
        const folders = document.querySelectorAll('.tree-node.folder');

        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('search-match', 'search-mismatch');
        });

        files.forEach(file => {
            const fileName = file.querySelector('.file-name')?.textContent.toLowerCase() || '';
            const fileTitle = (file.getAttribute('data-title') || '').toLowerCase();
            const badge = file.querySelector('.badge')?.textContent.toLowerCase() || '';

            if (fileName.includes(query) || fileTitle.includes(query) || badge.includes(query)) {
                file.classList.add('search-match');
                matchesCount++;

                // Expand and show all parent folders of the matched file
                let parent = file.parentElement;
                while (parent && parent !== treeRoot) {
                    if (parent.classList.contains('node-children')) {
                        const folderNode = parent.parentElement;
                        if (folderNode && folderNode.classList.contains('folder')) {
                            folderNode.classList.add('open');
                            folderNode.classList.add('search-match');
                        }
                    }
                    parent = parent.parentElement;
                }
            } else {
                file.classList.add('search-mismatch');
            }
        });

        folders.forEach(folder => {
            const hasMatchChild = folder.querySelector('.search-match');
            if (!hasMatchChild) {
                folder.classList.add('search-mismatch');
            } else {
                folder.classList.remove('search-mismatch');
            }
        });

        if (resultsCountEl) {
            resultsCountEl.textContent = `找到 ${matchesCount} 个匹配项`;
        }
        if (noResultsEl && treeRoot) {
            if (matchesCount === 0) {
                noResultsEl.style.display = 'block';
                treeRoot.style.display = 'none';
            } else {
                noResultsEl.style.display = 'none';
                treeRoot.style.display = 'block';
            }
        }
    }

    // Reset search state
    function resetSearch() {
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('search-match', 'search-mismatch');
        });

        // Restore default expanded state from initial data
        function applyInitialOpen(nodeList) {
            nodeList.forEach(n => {
                if (n.type === 'folder' && n.id) {
                    const el = document.getElementById(n.id);
                    if (el) {
                        if (n.open) el.classList.add('open');
                        else el.classList.remove('open');
                    }
                }
                if (n.children) applyInitialOpen(n.children);
            });
        }
        if (typeof COURSE_TREE_DATA !== 'undefined') {
            applyInitialOpen(COURSE_TREE_DATA);
        }

        if (resultsCountEl) {
            resultsCountEl.textContent = `共 ${totalFiles} 个 HTML 页面`;
        }
        if (noResultsEl) noResultsEl.style.display = 'none';
        if (treeRoot) treeRoot.style.display = 'block';
    }

    // Expose filterLegend for badge clicks
    window.filterLegend = function(badgeType) {
        if (searchInput) {
            searchInput.value = badgeType;
            if (clearBtn) clearBtn.style.display = 'block';
            performSearch(badgeType.toLowerCase());
        }
    };

    // Record last opened file in localStorage
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.node-link');
        if (link) {
            localStorage.setItem('lastOpenedFile', link.getAttribute('href'));
        }
    });
});

// Restore accordion state if last opened file is recorded
function restoreAccordionState() {
    const treeRoot = document.getElementById('project-tree');
    const lastOpened = localStorage.getItem('lastOpenedFile');
    if (lastOpened && treeRoot) {
        const targetLink = document.querySelector(`.node-link[href="${lastOpened}"]`);
        if (targetLink) {
            document.querySelectorAll('.tree-node.folder').forEach(f => {
                f.classList.remove('open');
            });

            const fileNode = targetLink.closest('.tree-node.file');
            if (fileNode) {
                document.querySelectorAll('.tree-node.file').forEach(f => {
                    f.classList.remove('search-match');
                });
                fileNode.classList.add('search-match');

                let parent = fileNode.parentElement;
                while (parent && parent !== treeRoot) {
                    if (parent.classList.contains('node-children')) {
                        const folderNode = parent.parentElement;
                        if (folderNode && folderNode.classList.contains('folder')) {
                            folderNode.classList.add('open');
                        }
                    }
                    parent = parent.parentElement;
                }

                setTimeout(() => {
                    fileNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }
}

// Run on pageshow to handle normal loading and Back-Forward Cache (bfcache) navigation
window.addEventListener('pageshow', restoreAccordionState);
