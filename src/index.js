import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

import connectDB from './db/index.db.js';
import app from './app.js';
connectDB()
.then( () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
}).catch( (error) => {
    console.error(`Error in connecting to the database: ${error.message}`);
    process.exit(1);
});
