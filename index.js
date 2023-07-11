const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "slotBooking",
});
con.connect((err) => {
  if (err) {
    console.log("err");
  } else {
    console.log("connected");
  }
});

app.post("/register", async (req, res) => {
  const date = req.body.date;
  const startSlot = req.body.startSlot;
  const endSlot = req.body.endSlot;
  con.query(
    "SELECT COUNT(*) AS cnt FROM confirmSlot WHERE date = ? ",
    date,
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        if (data[0].cnt > 0) {
          con.query(
            "SELECT COUNT(*) AS cnt FROM confirmSlot WHERE startSlot= ? AND endSlot = ? ",
            [startSlot, endSlot],
            function (err, data) {
              if (err) {
                console.log(err);
              } else {
                if (data[0].cnt > 0) {
                  res.send("This Slot is already Booked !");
                } else {
                  const data = req.body;
                  con.query(
                    "INSERT INTO confirmSlot SET ?",
                    data,
                    function (error, results, fields) {
                      if (error) throw error;
                      console.log(results.insertId);
                      res.send(results);
                    }
                  );
                }
              }
            }
          );
        } else {
          const data = req.body;
          con.query(
            "INSERT INTO confirmSlot SET ?",
            data,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results.insertId);
              res.send(results);
            }
          );
        }
      }
    }
  );
});

app.listen(6060, () => {
  console.log("server is running on 6060 port");
});
