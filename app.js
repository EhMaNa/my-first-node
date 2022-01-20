require('express-async-errors');
const express = require('express');
const app = express();
require('./startup/logging')();
require('./startup/app-use')(app);
require('./startup/db')();
require('./startup/prod')(app);




const port = process.env.PORT || 3000;
app.listen(port);



//app.use(expressLayouts);
//app.set('layout', 'layouts/layout');




