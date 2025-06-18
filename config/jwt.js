const dotenv = require('dotenv');

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET || '1234';


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; 

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
};
