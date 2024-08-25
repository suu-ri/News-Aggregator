// app.js

const apiKey = 'eeedf28586274d7196dcd92007daceda'; // 替换为你的API密钥
const newsSources = ['bbc-news', 'cnn', 'the-verge']; // 新闻源列表
const newsContainer = document.getElementById('news-container');
const filterButton = document.getElementById('filter-button');

// 获取新闻数据
async function fetchNews(startDate, endDate) {
    const promises = newsSources.map(source => {
        const url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`;
        return fetch(url).then(response => response.json());
    });

    const results = await Promise.all(promises);
    displayNews(results, startDate, endDate);
}

// 显示新闻
function displayNews(newsArray, startDate, endDate) {
    newsContainer.innerHTML = ''; // 清空之前的新闻
    newsArray.forEach(news => {
        if (news.articles) {
            news.articles.forEach(article => {
                const articleDate = new Date(article.publishedAt);
                if (isWithinDateRange(articleDate, startDate, endDate)) {
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('news-item');
                    newsItem.innerHTML = `
                        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                        <p>${article.description}</p>
                        <small>来源: ${article.source.name} | 日期: ${articleDate.toLocaleDateString()}</small>
                    `;
                    newsContainer.appendChild(newsItem);
                }
            });
        }
    });
}

// 检查日期是否在范围内
function isWithinDateRange(articleDate, startDate, endDate) {
    if (!startDate && !endDate) return true; // 如果没有设置日期范围，返回所有新闻
    if (startDate && endDate) {
        return articleDate >= new Date(startDate) && articleDate <= new Date(endDate);
    }
    if (startDate) {
        return articleDate >= new Date(startDate);
    }
    if (endDate) {
        return articleDate <= new Date(endDate);
    }
}

// 初始化
filterButton.addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    fetchNews(startDate, endDate);
});

// 默认加载所有新闻
fetchNews();