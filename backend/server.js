const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// SQL Server configuration
const config = {
    user: "node", // Database username
    password: "root", // Database password
    server: "localhost", // Server IP address
    database: "student", // Database name
    options: {
        encrypt: false // Disable encryption
    }
};

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

// Create a new student
app.post("/students", (req, res) => {
    const { id, name, mark, city } = req.body;
    const query = `INSERT INTO studentdetail (id, name, mark, city) VALUES (@id, @name, @mark, @city)`;

    new sql.Request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, name)
        .input('mark', sql.Int, mark)
        .input('city', sql.VarChar, city)
        .query(query, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send(err);
            }
            res.status(201).send({ message: "Student added successfully!" });
        });
});

// Get all students
app.get("/students", (req, res) => {
    const query = "SELECT * FROM studentdetail";

    new sql.Request().query(query, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send(err);
        }
        res.send(result.recordset);
    });
});

// Update a student
app.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { name, mark, city } = req.body;
    const query = `UPDATE studentdetail SET name = @name, mark = @mark, city = @city WHERE id = @id`;

    new sql.Request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, name)
        .input('mark', sql.Int, mark)
        .input('city', sql.VarChar, city)
        .query(query, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send(err);
            }
            res.send({ message: "Student updated successfully!" });
        });
});

// Delete a student
app.delete("/students/:id", (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM studentdetail WHERE id = @id`;

    new sql.Request()
        .input('id', sql.Int, id)
        .query(query, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send(err);
            }
            res.send({ message: "Student deleted successfully!" });
        });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
