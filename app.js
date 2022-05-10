const express = require('express');
const app = express();

app.use(express.static('.'));

app.get('/', function (req, res){
    res.send('Hello World');
});

app.get('/goodbye', function (req, res){
    res.send('Goodbye World');
});

app.get('/wow', function (req, res){
    res.send('You would be amazed how easy it is to fetch data');
});

const searchableItems = [
    'Bread',
    'Butter',
    'Peanut',
    'Margerine',
    'Pineapple',
    'Chocolate',
    'Coconut',
    'Tea',
];

app.get('/search', async function (req, res){
    let query = req.query['q'];
    let regex = new RegExp(query, 'i');
    let matchedItems = searchableItems.filter(item => regex.test(item));
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 7000);
    });
    res.send(matchedItems);
});

app.get('/location', async function (req, res){
    let long = req.query['long'], lat = req.query['lat'];
    res.send({
        long: long + 10,
        lat: lat + 80,
    });
});

app.listen(3000);
