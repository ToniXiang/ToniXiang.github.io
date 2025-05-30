document.addEventListener('DOMContentLoaded', () => {
    navigateTab(0); // 顯示第一個 Tab
});
// 顯示 article
function showTab(tabId,event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }
}
// 控制按鈕
const tabs = ['resume', 'goals', 'jobs'];
const tabNames = { resume: '簡歷', goals: '目標', jobs: '工作' };
let currentTabIndex = 0;

function navigateTab(direction) {
    currentTabIndex += direction;
    if (currentTabIndex < 0) {
        currentTabIndex = 0;
    } else if (currentTabIndex >= tabs.length) {
        currentTabIndex = tabs.length - 1;
    }
    showTab(tabs[currentTabIndex]);
    const tabNames = { resume: '簡歷', goals: '目標', jobs: '工作' };
    const prevTabName = document.getElementById('prevTabName');
    const nextTabName = document.getElementById('nextTabName');
    prevTabName.textContent = currentTabIndex > 0 ? tabNames[tabs[currentTabIndex - 1]] : '';
    nextTabName.textContent = currentTabIndex < tabs.length - 1 ? tabNames[tabs[currentTabIndex + 1]] : '';
    document.getElementById('prevTab').style.display = currentTabIndex === 0 ? 'none' : 'block';
    document.getElementById('nextTab').style.display = currentTabIndex === tabs.length - 1 ? 'none' : 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}