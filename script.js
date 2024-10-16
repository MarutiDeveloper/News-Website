const API_KEY = "2fc513f509e44d7a915516f2213dfcff";
const url = "https://newsapi.org/v2/everything?q=";
let currentPage = 1; // Track the current page
const pageSize = 10;  // Number of articles per page

window.addEventListener('load', () => fetchNews("india"));

// Fetch news based on the selected category or search query
function fetchNews(query, category = null) {
    const xhr = new XMLHttpRequest();
    let apiUrl = `${url}${query}&apikey=${API_KEY}&page=${currentPage}&pageSize=${pageSize}`;
    // If a category is passed, include it in the search query
    if (category) {
        apiUrl = `${url}${category}&apikey=${API_KEY}&page=${currentPage}&pageSize=${pageSize}`;
    }

    xhr.open('GET', apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);

            // Display total results
            showTotalResults(data.totalResults);

            // Call bindData to display articles
            bindData(data.articles, category);
        }
    };

    xhr.send(); // Send the request
}

// Bind news articles to the UI
function bindData(articles, category = null) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = ''; // Clear previous content

    articles.forEach(article => {
        if (!article.urlToImage) return;

        // If a category is passed, only display articles related to that category
        if (category && !isArticleInCategory(article, category)) {
            return; // Skip articles that do not match the category
        }

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Handle pagination for previous and next
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchNews("oldest"); // Fetch news for the current page
    }
}

function nextPage() {
    currentPage++;
    fetchNews("latest"); // Fetch news for the current page
}

// Helper function to check if the article matches the selected category
function isArticleInCategory(article, category) {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    // Check if the title or description contains the category keyword
    return title.includes(category.toLowerCase()) || description.includes(category.toLowerCase());
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');
    const newsCategory = cardClone.querySelector('#news-category'); // Get category element

    // Set the image, title, description, etc.
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;
    
    // Truncate the description to a minimum of 100 characters
    const truncatedDesc = truncateDescription(article.description, 100);
    newsDesc.innerHTML = truncatedDesc;

    // Determine the category for this article
    const category = determineCategory(article);
    newsCategory.innerHTML = category; // Set the category in the card

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} . ${date}`;

    // Add click event to open the article URL
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

// Function to truncate the description
function truncateDescription(description, maxLength) {
    if (!description) return ''; // Return empty if no description

    // Check if the description exceeds the max length
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'; // Truncate and add ellipses
    }

    return description; // Return full description if within the limit
}

// Function to determine the category based on article content
function determineCategory(article) {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    // Category mapping based on keywords
    if (title.includes('ipl') || description.includes('ipl')) {
        return 'Sports'; // For IPL, categorize as Sports
    } else if (title.includes('finance') || description.includes('finance')) {
        return 'Business'; // For finance-related news
    } else if (title.includes('politics') || description.includes('politics')) {
        return 'Politics'; // For politics-related news
    } else if (title.includes('technology') || description.includes('technology')) {
        return 'Technology'; // For tech-related news
    } else if (title.includes('business') || description.includes('business')) {
        return 'Business'; // For business-related news
    } else if (title.includes('sports') || description.includes('sports')) {
        return 'Sports'; // General sports category
    }

    return 'General'; // Default category if no match is found
}

// Display total results
function showTotalResults(totalResults) {
    const totalResultsContainer = document.getElementById('total-results');
    totalResultsContainer.innerHTML = `Total Results: ${totalResults}`;
}

// Handle category selection
let curSelectedNav = null;
function onNavItemClick(category) {
    fetchNews("latest", category); // Fetch news for the selected category
    const navItem = document.getElementById(category);
    curSelectedNav?.classList.remove('active');
    curSelectedNav.classList.add('active');
}

// Search button functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
});