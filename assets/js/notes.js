// 筆記頁面功能
document.addEventListener('DOMContentLoaded', () => {
    initializeNotes();
    setupNoteInteractions();
    // 預設將所有分類設為摺疊
    collapseAllCategories();
});

function collapseAllCategories() {
    const categories = document.querySelectorAll('.note-category');
    categories.forEach(category => {
        category.classList.add('collapsed');
    });
    console.log('所有分類已摺疊');
}

function initializeNotes() {
    // 為內部筆記添加點擊事件
    const internalNotes = document.querySelectorAll('.note-item');
    internalNotes.forEach(note => {
        note.addEventListener('click', handleInternalNoteClick);
    });


    // 添加分類摺疊功能
    setupCategoryCollapse();
}

function handleInternalNoteClick(event) {
    // 阻止事件冒泡，避免觸發分類摺疊
    event.stopPropagation();

    const noteTitle = event.currentTarget.querySelector('h3').textContent;

    // 創建模擬的筆記內容頁面
    showNoteModal(noteTitle);
}


function showNoteModal(title) {
    console.log('正在顯示筆記:', title);

    // 檢查是否已存在彈窗，如果有則先關閉
    const existingModal = document.querySelector('.note-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 創建模擬的筆記內容彈窗
    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>這是 <strong>${title}</strong> 的內容預覽。</p>
                <p>在實際實作中，這裡會顯示完整的筆記內容，包括：</p>
                <ul>
                    <li>詳細的技術說明</li>
                    <li>程式碼範例</li>
                    <li>實作步驟</li>
                    <li>相關參考資源</li>
                </ul>
                <p class="note-info">筆記建立時間：xxxx/xx/xx</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('彈窗已添加到DOM');

    // 添加關閉事件
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => closeNoteModal(modal));
    overlay.addEventListener('click', () => closeNoteModal(modal));

    // ESC 鍵關閉
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeNoteModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // 確保彈窗立即顯示
    requestAnimationFrame(() => {
        modal.classList.add('show');
        console.log('彈窗顯示動畫已觸發');
    });
}

function closeNoteModal(modal) {
    console.log('正在關閉彈窗');
    if (modal && modal.parentNode) {
        modal.classList.add('hiding');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
                console.log('彈窗已移除');
            }
        }, 300);
    }
}

function setupCategoryCollapse() {
    const categoryHeaders = document.querySelectorAll('.category-header');

    categoryHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            const category = header.parentElement;
            const noteList = category.querySelector('.note-list');

            // 切換摺疊狀態
            category.classList.toggle('collapsed');

            console.log('分類狀態切換:', category.classList.contains('collapsed') ? '摺疊' : '展開');
        });
    });
}

function setupNoteInteractions() {
    // 預留其他互動功能
    console.log('筆記互動功能已準備就緒');
}

