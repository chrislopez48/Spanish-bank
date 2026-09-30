//creates and runs backend server,loading express and creating backend app. our first api route
const express = require("express");
const cors = require("cors");
const Database =require("better-sqlite3");                //this will get rid of temp js array
const path = require("path");

const app = express();
const port = 3000;
//const db = new Database("vocabulary.db");
const dbPath = path.join(__dirname, "data", "vocabulary.db");
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spanish TEXT NOT NULL,
    english TEXT NOT NULL
  )
`).run();

app.use(express.json());
app.use(cors());



app.get("/", (request, response) => {
  response.json({
    message: "Spanish Vocabulary API is running",
  });
});

app.get("/words", (req, res) => {
  const words = db
    .prepare("SELECT * FROM vocabulary ORDER BY id")
    .all();

  res.json(words);
});


app.get("/words/:id", (req, res) => {
  const id = Number(req.params.id);

  const word = db
    .prepare("SELECT * FROM vocabulary WHERE id = ?")                 //? just placeholder
    .get(id);

  if (!word) {
    return res.status(404).json({
      error: "Word not found.",
    });
  }

  res.json(word);
});


app.post("/words", (req, res) => {
  const { spanish, english } = req.body;

  const cleanSpanish = spanish?.trim();
  const cleanEnglish = english?.trim();

  if (!cleanSpanish || !cleanEnglish) {
    return res.status(400).json({
      error: "Spanish and English are required.",
    });
  }

  const result = db
    .prepare(`
      INSERT INTO vocabulary (spanish, english)
      VALUES (?, ?)
    `)
    .run(cleanSpanish, cleanEnglish);

  const newWord = db
    .prepare("SELECT * FROM vocabulary WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newWord);
});


app.delete("/words/:id", (req, res) => {
  const id = Number(req.params.id);

  const word = db
    .prepare("SELECT * FROM vocabulary WHERE id = ?")
    .get(id);

  if (!word) {
    return res.status(404).json({
      error: "Word not found.",
    });
  }

  db
    .prepare("DELETE FROM vocabulary WHERE id = ?")
    .run(id);

  res.json({
    message: "Word deleted successfully.",
    word: word,
  });
});
                                                                    //code below checks words existence and updates sqlite
app.put("/words/:id", (req, res) => {
  const id = Number(req.params.id);
  const { spanish, english } = req.body;

  const cleanSpanish = spanish?.trim();
  const cleanEnglish = english?.trim();

  if (!cleanSpanish || !cleanEnglish) {
    return res.status(400).json({
      error: "Spanish and English are required.",
    });
  }

  const existingWord = db
    .prepare("SELECT * FROM vocabulary WHERE id = ?")
    .get(id);

  if (!existingWord) {
    return res.status(404).json({
      error: "Word not found.",
    });
  }

  db.prepare(`
    UPDATE vocabulary
    SET spanish = ?, english = ?
    WHERE id = ?
  `).run(cleanSpanish, cleanEnglish, id);

  const updatedWord = db
    .prepare("SELECT * FROM vocabulary WHERE id = ?")
    .get(id);

  res.json(updatedWord);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});