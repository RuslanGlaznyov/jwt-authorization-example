const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/testdb_TEST";
const PORT = process.env.PORT || 3010;
const SECRET = process.env.SECRET || 'SECRET';

module.exports = {
    MONGO_URL,
    PORT,
    SECRET
};