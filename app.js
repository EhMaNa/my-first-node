const express = require('express');
const app = express();





const port = process.env.PORT || 3000;
app.listen(port);


app.set('view engine', 'ejs');
//app.use(expressLayouts);
//app.set('layout', 'layouts/layout');
app.use('/folder', express.static('folder'));
app.use(express.urlencoded({ extended: false }));


app.use('/', require('./routes/route'));
