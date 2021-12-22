const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    // database:process.env.DATABASE,
    // port:process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    //  console.log('db ' + connection.state);
}) 

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM libdb.library_books_list";
                connection.query(query, (err, res) => {
                    if (err) reject(new Error(err.message));
                    resolve(res);
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async insertNewRow(Name, Author, Genere, Edition) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO libdb.library_books_list (Name,Author,Genere,Edition) VALUES (?,?,?,?);";
                connection.query(query, [Name, Author, Genere, Edition], (err, res) => {
                    if (err) reject(new Error(err.message));
                    resolve(res.affectedRows);
                })
            })
            // console.log(response);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    async deleteRow(id) {
        id = parseInt(id, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM libdb.library_books_list WHERE id=?;";
                connection.query(query, [id], (err, res) => {
                    if (err) reject(new Error(err.message));
                    resolve(res.affectedRows);

                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            // return false;
        }
    }
    async updateRow(Name, Author, Genere, Edition, id) {
        try {
            // id = parseInt(id, 10);
            //    console.log(id);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE libdb.library_books_list SET Name=?,Author=?, Genere=?, Edition=? WHERE id=?;";
                connection.query(query, [Name, Author, Genere, Edition, id], (err, res) => {
                    if (err) reject(new Error(err.message));
                    resolve(res);
                })
            })
            console.log(response);
            return response.affectedRows;

        } catch (err) {
            console.log(err);
        }
    }
}

// have received no data base selected 

//????have to reset all ids in proper order from 1 when a row is deleted
module.exports = DbService;