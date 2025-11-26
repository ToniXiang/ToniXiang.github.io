// 筆記頁面功能
document.addEventListener('DOMContentLoaded', () => {
    initializeNotes();
    setupNoteInteractions();
});

function initializeNotes() {
    // 為內部筆記添加點擊事件
    const internalNotes = document.querySelectorAll('.note-item');
    internalNotes.forEach(note => {
        note.addEventListener('click', handleInternalNoteClick);
    });
}

function handleInternalNoteClick(event) {
    const noteTitle = event.currentTarget.querySelector('.note-title').textContent;
    showNoteModal(noteTitle);
}

// 將筆記標題轉換為對應的檔案名稱，支持 .md 和 .txt
function getNoteFileName(title) {
    const cleanTitle = title.trim();
    // 優先檢查 .md 檔案，然後檢查 .txt 檔案
    return {
        md: cleanTitle + '.md',
        txt: cleanTitle + '.txt'
    };
}

// 從檔案讀取筆記內容，支持 .md 和 .txt
async function loadNoteContent(title) {
    const fileNames = getNoteFileName(title);

    // 先嘗試讀取 .md 檔案
    try {
        const mdResponse = await fetch(`assets/notes/${fileNames.md}`);
        if (mdResponse.ok) {
            const content = await mdResponse.text();
            return {
                success: true,
                content: content,
                type: 'markdown'
            };
        }
    } catch (error) {
        console.log(`Markdown 檔案不存在: ${fileNames.md}`);
    }

    // 如果 .md 檔案不存在，嘗試讀取 .txt 檔案
    try {
        const txtResponse = await fetch(`assets/notes/${fileNames.txt}`);
        if (txtResponse.ok) {
            const content = await txtResponse.text();
            return {
                success: true,
                content: content,
                type: 'text'
            };
        }
        throw new Error(`檔案不存在: ${fileNames.txt}`);
    } catch (error) {
        console.error('讀取筆記內容失敗:', error);
        return {
            success: false,
            error: `無法找到檔案: ${fileNames.md} 或 ${fileNames.txt}`
        };
    }
}

// 簡單的 Markdown 解析器
function parseMarkdown(text) {
    // 正規化行尾 (支援 Windows CRLF)
    text = text.replace(/\r\n?/g, '\n');

    // 暫存並保護多行程式碼區塊
    const codeBlocks = [];
    text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? `language-${lang.toLowerCase()}` : 'language-text';
        const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?/g, '\n');
        const html = `<pre><code class="${language}">${cleanCode}</code></pre>`;
        const placeholder = `@@CODEBLOCK_${codeBlocks.length}@@`;
        codeBlocks.push(html);
        return placeholder;
    });

    // 行內程式碼
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<code class="language-text">${cleanCode}</code>`;
    });

    // 標題
    text = text
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // 分隔線 (--- 或 *** 或 ___)
    text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<hr>');

    // 粗體與斜體
    text = text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 連結
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 列表項 (先標記為 <li>)
    text = text
        .replace(/^(?:\* |- )(.*)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

    // 合併連續的 <li> 為一個 <ul>
    text = text.replace(/(?:<li>[^<]*<\/li>\n?)+/g, (match) => {
        const items = match.trim().replace(/\n/g, '');
        return `<ul>${items}</ul>`;
    });

    // 分段：以 2+ 連續換行分隔段落（避免產生多個 <br>）
    const blocks = text.split(/\n{2,}/).map(block => block.trim()).filter(b => b.length > 0);

    const htmlBlocks = blocks.map(block => {
        // 如果已是獨立區塊型標籤則直接返回
        if (/^(<h[1-6]>|<ul>|<pre>|<blockquote>|<hr>)/.test(block)) {
            return block;
        }
        // 檢查是否只是單行內容，避免不必要的 <br>
        if (!block.includes('\n')) {
            return `<p>${block}</p>`;
        }
        // 其餘行內換行轉 <br>，但避免連續的 <br>
        const withBr = block.replace(/\n+/g, '<br>');
        return `<p>${withBr}</p>`;
    });

    let html = htmlBlocks.join('');

    // 還原程式碼區塊（保持原始換行，不插入 <br>）
    html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (m, i) => codeBlocks[i]);

    return html;
}


function showNoteModal(title) {
    console.log('正在顯示筆記:', title);

    // 檢查是否已存在彈窗，如果有則先關閉
    const existingModal = document.querySelector('.note-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 創建筆記內容彈窗
    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-header">
            <img src="assets/images/description.svg" alt="notes" width="20" height="20" class="icon-img" aria-hidden="true">
            <p class="modal-title">${title}</p>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <div class="loading">載入中...</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('彈窗已添加到DOM');

    // 載入並顯示筆記內容
    loadNoteContent(title).then(result => {
        const modalBody = modal.querySelector('.modal-body');
        if (result.success) {
            if (result.type === 'markdown') {
                // Markdown 內容解析並渲染為 HTML
                const htmlContent = parseMarkdown(result.content);
                modalBody.innerHTML = `<div class="note-content markdown-content">${htmlContent}</div>`;

                // 觸發 Prism.js 語法高亮
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAllUnder(modalBody);
                }
            } else {
                // 純文字內容保持原格式
                modalBody.innerHTML = `<pre class="note-content text-content"><code class="language-text">${result.content}</code></pre>`;

                // 觸發 Prism.js 語法高亮
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAllUnder(modalBody);
                }
            }
        } else {
            modalBody.innerHTML = `
                <div class="error-message">
                    <p>無法載入筆記內容</p>
                    <p class="error-detail">${result.error}</p>
                    <p class="note-placeholder">這是 <strong>${title}</strong> 的佔位內容，實際內容將從對應的 .md 或 .txt 檔案載入。</p>
                </div>
            `;
        }
    }).catch(error => {
        console.error('載入筆記內容時發生錯誤:', error);
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="error-message">
                <p>載入筆記時發生錯誤</p>
                <p class="error-detail">${error.message}</p>
            </div>
        `;
    });

    // 添加關閉事件
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => closeNoteModal(modal));
    overlay.addEventListener('click', () => closeNoteModal(modal));

    // ESC 鍵關閉
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeNoteModal(modal);
        }
    };
    document.addEventListener('keydown', escHandler);
    // 存儲事件處理器以便後續清理
    modal._escHandler = escHandler;

    // 確保彈窗立即顯示
    requestAnimationFrame(() => {
        modal.classList.add('show');
        console.log('彈窗顯示動畫已觸發');
    });
}

function closeNoteModal(modal) {
    console.log('正在關閉彈窗');
    if (modal && modal.parentNode) {
        // 清理 ESC 鍵監聽器
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler);
            delete modal._escHandler;
        }

        modal.classList.add('hiding');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
                console.log('彈窗已移除');
            }
        }, 300);
    }
}



function setupNoteInteractions() {
    // 預留其他互動功能
    console.log('筆記互動功能已準備就緒');
}
