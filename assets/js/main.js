// 獲取我 GitHub 上的項目
const apiUrl = `https://api.github.com/users/ChenGuoXiang940/repos`;
fetch(apiUrl)
    .then(response => response.json())
    .then(repos => {
        let repoList = document.getElementById("repo-list");
        repos.forEach(repo => {
            let row = document.createElement("tr");
            let updatedDate = new Date(repo.updated_at).toLocaleDateString('zh-Hant-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            row.innerHTML = `
                <td><a href="${repo.html_url}" target="_blank">${repo.name.replace(/_/g, ' ')}</a></td>
                <td>${repo.description || '沒有任何描述'}</td>
                <td>${updatedDate}</td>
            `;
            repoList.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching GitHub repos:", error));