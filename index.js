const http = require('http');
const url = require('url');
const fs = require('fs');

function replaceTemplate(templateCard, product) {
    let output = templateCard.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overvire.html`, 'utf-8');
const templateproduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const server = http.createServer((request, response) => {


    const { query, pathname } = url.parse(request.url, true);


    //overview
    if (pathname === '/' || pathname === '/overview') {
        const cardHtml = dataObject.map((e) => {
            return replaceTemplate(templateCard, e);
        }).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.end(output);
    }
    //products
    else if (pathname === '/product') {
        response.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObject[query.id];
        const output = replaceTemplate(templateproduct, product);
        response.end(output);
    }
    else if (pathname === '/api') {

        response.writeHead(200, {
            'Content-type': 'application/json'
        });
        response.end(data)


    }
    else {
        response.writeHead(404, {
            'Content-type': 'text/html'
        });
        response.end('<h1> page not found </h1>')
    }
});

server.listen(8000, () => {
    console.log("server starts at port 8000");
})