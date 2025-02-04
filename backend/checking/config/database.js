const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: '127.0.0.1',  // Using IP instead of localhost
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            // For MySQL 8.0 and later
            authPlugins: {
                mysql_native_password: () => ()=>{}
            }
        }
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message);
    });

module.exports = sequelize; 