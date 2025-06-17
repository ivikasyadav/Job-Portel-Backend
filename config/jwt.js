const dotenv = require('dotenv');

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; 

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
};
