import {DB} from './connect.js';
import ratingsRoutes from './routes/ratingsRoutes.js'
import commentsRoutes from './routes/commentsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import giphyRoutes from './routes/giphyRoutes.js'

import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send('CoSchedule Code Challenge: Giphy Edition is online!');
});

app.use('/ratings', ratingsRoutes)
app.use('/comments', commentsRoutes)
app.use('/user', userRoutes)
app.use('/giphy', giphyRoutes)

app.listen(3000, (err)=> {
    if(err) {
        console.log('LISTEN ERROR: ', err.message);
    }
    console.log('LISTENING ON port 3000')
});