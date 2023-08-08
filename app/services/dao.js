const userQueries = require("./queries/userQuery");

const dao = {};

dao.getUserByEmail = async (email) => await userQueries.getUserByEmail(email);
dao.addUser = async (userData) => await userQueries.addUser(userData);
dao.getUserById = async (id) => await userQueries.getUserById(id);
dao.deleteUser = async (id) => await userQueries.deleteUser(id);
dao.updateUser = async (id, userData) => await userQueries.updateUser(id, userData);

module.exports = dao;