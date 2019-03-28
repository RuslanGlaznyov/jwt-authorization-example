const MONGO_URL = "mongodb://localhost:27017/testdb";
const PORT = process.env.PORT || 3010;
const SECRET = process.env.SECRET || 'SECRET';

exports.MONGO_URL = MONGO_URL;
exports.PORT = PORT;
exports.SECRET = SECRET;