// app.js

const apiKey = 'eeedf28586274d7196dcd92007daceda'; // Replace with your API key
const newsSources = ['bbc-news', 'cnn', 'the-verge']; // News sources list
const newsContainer = document.getElementById('news-container');
const filterButton = document.getElementById('filter-button');

// Fetch news data
async function fetchNews(startDate, endDate) {
    const promises = newsSources.map(source => {
        const url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`;
        return fetch(url).then(response => response.json());
    });

    const results = await Promise.all(promises);
    displayNews(results, startDate, endDate);
}

// Display news
function displayNews(newsArray, startDate, endDate) {
    newsContainer.innerHTML = ''; // Clear previous news
    newsArray.forEach(news => {
        if (news.articles) {
            news.articles.forEach(article => {
                const articleDate = new Date(article.publishedAt);
                if (isWithinDateRange(articleDate, startDate, endDate)) {
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow', 'hover:shadow-lg', 'transition', 'duration-200');
                    newsItem.innerHTML = `
                        <h2 class="text-xl font-semibold">
                            <a href="${article.url}" target="_blank" class="text-blue-600 hover:underline hover:text-blue-800 transition duration-200">${article.title}</a>
                        </h2>
                        <p class="mt-2 text-gray-600">${article.description}</p>
                        <small class="text-gray-500">Source: ${article.source.name} | Date: ${articleDate.toLocaleDateString('en-US')}</small>
                    `;
                    newsContainer.appendChild(newsItem);
                }
            });
        }
    });
}

// Check if date is within range
function isWithinDateRange(articleDate, startDate, endDate) {
    if (!startDate && !endDate) return true; // If no date range is set, return all news
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

// Initialize
filterButton.addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    fetchNews(startDate, endDate);
});

// Load all news by default
fetchNews();