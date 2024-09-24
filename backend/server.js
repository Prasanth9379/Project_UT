const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const config = {
    user: "node",
    password: "root",
    server: "localhost",
    database: "student",
    options: {
        encrypt: false
    }
};

sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

app.post("/students", (req, res) => {
    const { id, name, mark, city, dob } = req.body;
    console.log('Inserting student:', { id, name, mark, city, dob });
    const query = `INSERT INTO studentdetail (id, name, mark, city, dob) VALUES (@id, @name, @mark, @city, @dob)`;

    new sql.Request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, name)
        .input('mark', sql.Int, mark)
        .input('city', sql.VarChar, city)
        .input('dob', sql.Date, dob ? new Date(dob) : null)
        .query(query, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send(err);
            }
            res.status(201).send({ message: "Student added successfully!" });
        });
});

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

app.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { name, mark, city, dob } = req.body;
    console.log('Updating student:', { id, name, mark, city, dob });
    const query = `UPDATE studentdetail SET name = @name, mark = @mark, city = @city, dob = @dob WHERE id = @id`;

    new sql.Request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, name)
        .input('mark', sql.Int, mark)
        .input('city', sql.VarChar, city)
        .input('dob', sql.Date, dob ? new Date(dob) : null)
        .query(query, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send(err);
            }
            res.send({ message: "Student updated successfully!" });
        });
});

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

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
