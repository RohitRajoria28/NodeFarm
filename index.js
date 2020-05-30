const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////FILES ////////

// const textIn=fs.readFileSync("./txt/input.txt","utf-8")

// console.log(textIn);

// const textOut="this is what we know about the :${textIn} "

// fs.writeFileSync("./txt/output.txt",textOut);

// console.log("done ")

// fs.readFile("./txt/starttt.txt","utf-8",(err,data1)=>{

//     if(err) return console.log("errorrr !!!!");

// fs.readFile('./txt/append.txt',"utf-8",(err,data2)=>{
//     console.log(data2);

//   fs.writeFile("./txt/final.txt",`${data2}`,"utf-8",(err)=>{
//       console.log("we have writen")
//   })

//   });
// });

//////////SERVER /////////////

// const  replaceTemplate= (temp,product)=>{

//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);

//   if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//   return output;

// };

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/templates-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/templates-cards.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/templates-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

console.log(slugify('Fresh Avacardo', { lower: true }));

const server = http.createServer((req, res) => {
  //  const pathName=req.url;

  const { query, pathname } = url.parse(req.url, true);

  ////////OVERVIEW//////
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardshtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');

    const output = templateOverview.replace('{%PRODUCT_CARD%}', cardshtml);
    res.end(output);
  }

  ////////PRODUCT/////////
  else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];

    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }

  /////////API PAGE////////
  else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' }).join('');
    res.end(data);
  }

  ////////ERROR PAGE////////////////
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      //+ 'my-own-header': 'hello world'
    });
    res.end('<h1>PAGE NOT FOUND !!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('working on server 8000');
});
