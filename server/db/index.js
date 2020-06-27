const mysql = require('mysql');
const util = require('util');
// allowing access to our environmental variables, in a .env file in root directory
require('dotenv').config({ path: '../.env' });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'crawl';

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

// // production connection
// const connection = mysql.createConnection({
//   host: `/cloudsql/${process.env.DB_INSTANCE}`,
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   socketPath: `/cloudsql/${process.env.DB_INSTANCE}`,
// });

const query = util.promisify(connection.query).bind(connection);

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected!');
  }
});

// USER QUERIES
const getUser = (email) => {
  const mysqlQuery = 'SELECT * FROM User WHERE Email = ?;';
  return query(mysqlQuery, [email]);
};

const postUser = ({
  username, nameFirst, nameLast, phoneNumber, email, imageUrl, lat, lng,
}) => {
  if (!lat) {
    lat = 0.0;
  }
  if (!lng) {
    lng = 0.0;
  }
  const mysqlQuery = 'INSERT IGNORE INTO User VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  return query(
    mysqlQuery,
    [username, nameFirst, nameLast, phoneNumber, email, imageUrl, lat, lng, 0],
  );
};

const updateContact = (number, userId) => {
  const mysqlQuery = 'UPDATE User SET Phone_Number = ? WHERE Id = ?;';
  return query(mysqlQuery, [number, userId]);
};

const updateUserLoc = (location, idUser) => {
  const { lat, lng } = location;
  const mysqlQuery = 'UPDATE User SET Lat = ?, Lng = ? WHERE Id = ?;';
  return query(mysqlQuery, [lat, lng, idUser]);
};

const getCrawlsUsers = (idCrawl) => {
  const mysqlQuery = 'SELECT * FROM User INNER JOIN User_Crawl ON User_Crawl.Id_User = User.Id WHERE User_Crawl.Id_Crawl = ?;';
  return query(mysqlQuery, [idCrawl]);
};

// CRAWL QUERIES
const getCrawl = (idCreator) => {
  const mysqlQuery = 'SELECT * FROM Crawl WHERE Id_Creator = ?;';
  return query(mysqlQuery, [idCreator]);
};

const getUsersCrawls = (idUser) => {
  const mysqlQuery = 'SELECT * FROM User_Crawl INNER JOIN Crawl ON Crawl.Id = User_Crawl.Id_Crawl && User_Crawl.Id_User = ?;';
  return query(mysqlQuery, [
    idUser,
  ]);
};

const getOneCrawl = (id) => {
  const mysqlQuery = 'SELECT * FROM Crawl WHERE Id = ?;';
  return query(mysqlQuery, [id]);
};

const joinCrawl = (idUser, idCrawl) => {
  const mysqlQuery = 'INSERT IGNORE INTO User_Crawl VALUES(null, ?, ?);';
  return query(mysqlQuery, [idUser, idCrawl]);
};

const getJoinedCrawls = (idUser) => {
  const mysqlQuery = 'SELECT * FROM User_Crawl WHERE Id_User = ?;';
  return query(mysqlQuery, [idUser]);
};

const postCrawl = ({
  idCreator, title, crawlDate, crawlTime,
}) => {
  const mysqlQuery = 'INSERT INTO Crawl VALUES(null, ?, ?, ?, ?, ?);';
  return query(mysqlQuery, [
    idCreator,
    title,
    crawlDate,
    crawlTime,
    0,
  ]);
};

// LOCATION QUERIES
const getLocation = (name) => {
  const mysqlQuery = 'SELECT * FROM Location WHERE Name = ?;';
  return query(mysqlQuery, [
    name,
  ]);
};

// const getLocationById = (idLocation) => {
//   const mysqlQuery = 'SELECT * FROM Location WHERE Id = ?';
//   return query(mysqlQuery, [idLocation]);
// };

const getLocsInCrawl = (idCrawl) => {
  const mysqlQuery = 'SELECT * FROM Location_Crawl INNER JOIN Location ON Location.Id = Location_Crawl.Id_Location && Location_Crawl.Id_Crawl = ?;';
  return query(mysqlQuery, [
    idCrawl,
  ]);
};

const postLocations = ({
  address, lat, lng, name,
}) => {
  const mysqlQuery = 'INSERT IGNORE INTO Location VALUES(null, ?, ?, ?, ?);';
  return query(mysqlQuery, [
    address,
    lat,
    lng,
    name,
  ]);
};

// STATUS QUERIES
const getCrawlStatusNum = (idCrawl) => {
  const mysqlQuery = 'SELECT Crawl_Status from Crawl WHERE Id = ?';
  return query(mysqlQuery, [idCrawl]);
};

const getLocationOfCrawl = (idCrawl) => {
  const mysqlQuery = `
    SELECT Name from Location INNER JOIN Location_Crawl INNER JOIN Crawl
    ON Location_Crawl.Order_Position = Crawl_Status
    && Crawl.Id = ?
    && Location.Id = Location_Crawl.Id_Location
    && Crawl.Id = Location_Crawl.Id_Crawl;
  `;
  return query(mysqlQuery, [idCrawl]);
};

// advances crawl status by 1
const changeCrawlStatus = async (idCrawl) => {
  const mysqlQuery = 'UPDATE Crawl SET Crawl_Status = Crawl_Status + 1 WHERE Id = ?';
  return query(mysqlQuery, [idCrawl]);
};

// get vote flag for a current user
// const getVote = (idUser) => {
//   const mysqlQuery = 'SELECT Has_Voted FROM User WHERE Id = ?';
//   return query(mysqlQuery, [idUser]);
// };

// flip vote flag of user
// const flipVote = (idUser) => {
//   const mysqlQuery = 'UPDATE User SET Has_Voted = !Has_Voted WHERE Id = ?;';
//   return query(mysqlQuery, [idUser]);
// };

// count votes of users attending a bar crawl
// const countVotes = (idCrawl) => {
//   const mysqlQuery = `
//     SELECT COUNT(*) FROM User INNER JOIN User_Crawl
//     ON User_Crawl.Id_Crawl = 1
//     && User.Has_Voted = 1;
//   `;
//   return query(mysqlQuery, [idCrawl]);
// };

// reset all votes (when the crawl status changes)
// const resetVotes = (idCrawl) => {
//   const mysqlQuery = ``;
//   return query(mysqlQuery, [idCrawl]);
// };

// JOIN QUERIES
const locationCrawl = (idLocation, idCrawl, order) => {
  const mysqlQuery = 'INSERT IGNORE INTO Location_Crawl VALUES(null, ?, ?, ?);';
  return query(mysqlQuery, [
    idLocation,
    idCrawl,
    order,
  ]);
};

const userCrawl = (idUser, idCrawl) => {
  const mysqlQuery = 'INSERT IGNORE INTO User_Crawl VALUES(null, ?, ?);';
  return query(mysqlQuery, [
    idUser,
    idCrawl,
  ]);
};

module.exports = {
  // USERS
  getUser,
  postUser,
  updateContact,
  updateUserLoc,
  getCrawlsUsers,
  // CRAWLS
  getCrawl,
  getUsersCrawls,
  getOneCrawl,
  postCrawl,
  joinCrawl,
  getJoinedCrawls,
  // LOCATIONS
  getLocation,
  postLocations,
  getLocsInCrawl,
  // STATUS
  getCrawlStatusNum,
  getLocationOfCrawl,
  changeCrawlStatus,
  // VOTING
  // getVote,
  // flipVote,
  // countVotes,
  // resetVotes,
  // JOIN
  locationCrawl,
  userCrawl,
};
