const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://books.toscrape.com/catalogue/category/books/science_22/index.html';

async function scrapeData() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const books = [];

        $('.product_pod').each((i, el) => {
            const title = $(el).find('h3 a').attr('title');
            const price = $(el).find('.price_color').text();
            const rating = $(el).find('.star-rating').attr('class').split(' ')[1];

            books.push({ title, price, rating });
        });

        const csvHeader = 'Title,Price,Rating\n';
        const csvRows = books.map(b => `"${b.title}","${b.price}","${b.rating}"`).join('\n');

        fs.writeFileSync('books.csv', csvHeader + csvRows);
        console.log('✅ Scraping complete! Data saved to books.csv');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

scrapeData();
