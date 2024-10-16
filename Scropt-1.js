const API_KEY = "ff3746e9f5444981850cf220a694d556";
        const url = "https://newsapi.org/v2/everything?q=";

// Example function to fetch and display news
function displayNews(newsArray) {
    // Get the total count element
    const newsCountElement = document.getElementById('news-count');

    // Update the total count
    newsCountElement.innerText = `Total Results: ${newsArray.length}`;

    const template = document.getElementById('template-news-card').content;

    // Loop through the newsArray to create news cards
    newsArray.forEach(newsItem => {
        const newsClone = template.cloneNode(true);

        // Update the content with actual news data
        newsClone.querySelector('#news-img').src = newsItem.imageUrl || 'https://via.placeholder.com/400x200';
        newsClone.querySelector('#news-category').innerText = newsItem.category;
        newsClone.querySelector('#news-title').innerText = newsItem.title;
        newsClone.querySelector('#news-source').innerText = `${newsItem.source} ${newsItem.publishedDate}`;
        newsClone.querySelector('#news-desc').innerText = newsItem.description;
        newsClone.querySelector('#news-url').href = newsItem.url;

        // Append the news card to the content
        document.querySelector('.row.content').appendChild(newsClone);
    });
}

// Example of fetching news data (this should be replaced with your API call)
const newsData = [
    {
        imageUrl: 'https://via.placeholder.com/400x200',
        category: 'Technology',
        title: 'Tech News 1',
        source: 'TechCrunch',
        publishedDate: '26/08/2024',
        description: 'Latest news about technology...',
        url: '#'
    },
    // Add more news objects as needed
];

// Call the display function with the fetched news data
displayNews(newsData);
