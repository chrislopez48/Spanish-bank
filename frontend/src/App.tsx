import { useEffect, useState } from "react";               //useState is function
import type { FormEvent } from "react";
import "./App.css";

type VocabularyWord = {
  id?: number;
  spanish: string;
  english: string;
};                                              // the actual boxes in the program

function App() {
  const [spanishWord, setSpanishWord] = useState("");  //usestate "" means it starts empty
  const [englishWord, setEnglishWord] = useState("");
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/words")
      .then((response) => response.json())                    //takes reponse and converts to JSON JS data
      .then((data) => {
        setVocabulary(data);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);
 
function resetForm() 
      {
        setEditingId(null);
        setSpanishWord("");
        setEnglishWord("");
      }

                                                              //func below runs by clicking "add word"
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
                                                               //type word ->comes to this func
    if (!spanishWord.trim() || !englishWord.trim()) {
      return;                                                  //! means if something was typed, we're good
    }

    if (editingId !==null) {
      fetch(`http://localhost:3000/words/${editingId}`, {
        method : "PUT",                                         //crud api, put=update, grab id num from line above
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spanish: spanishWord.trim(),
          english: englishWord.trim(),
        }),
      })
        .then((response) => response.json())
        .then((updatedWord) => {
          setVocabulary(
            vocabulary.map((word) => 
              word.id === editingId ? updatedWord : word           // ? : ternary operator. shorter version of if/else
          )
        );
            resetForm();
        });

      return;
    }

    const newWord: VocabularyWord = {
      spanish: spanishWord.trim(),
      english: englishWord.trim(),
    };                                                               //creates new object
                                                                    //fetch below sends this to backend
fetch("http://localhost:3000/words", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newWord),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to add word");
    }

    return response.json();
  })
  .then((savedWord) => {
    setVocabulary([...vocabulary, savedWord]);
    resetForm();
  })
  .catch((error) => {
    console.error(error);
  });
} 

function handleEdit(word: VocabularyWord) {
  if (word.id === undefined) {
    return;                                                           // 5 == "5" is true, but 5 === "5" is false. == tries to convert types, === doesnt
  }
  setSpanishWord(word.spanish);
  setEnglishWord(word.english);
  setEditingId(word.id);
}

function handleDelete(id: number) {
  fetch(`http://localhost:3000/words/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete word");
      }

      return response.json();
    })
    .then(() => {
      setVocabulary(
        vocabulary.filter((word) => word.id !== id)
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

  return (
    <main>
      <h1>Spanish Vocabulary Bank</h1>

      <p>Add Spanish words as you learn them.</p>
      
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="spanish-word">Spanish word</label>

        <input
          id="spanish-word"
          type="text"
          value={spanishWord}
          onChange={(event) => setSpanishWord(event.target.value)}  //after word is types, this runs and changes spanishWord
          placeholder="Example: aprender"
        />

        <label htmlFor="english-word">English translation</label>

        <input
          id="english-word"
          type="text"
          value={englishWord}
          onChange={(event) => setEnglishWord(event.target.value)}    //after "to learn" is typed, englishword changes
          placeholder="Example: to learn"
        />

        <button type="submit">
          {editingId !== null ? "Update Word" : "Add Word"}
          </button>


        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
  >
    Cancel Edit
  </button>
)}
</form>

      <h2>My Words</h2>

      {vocabulary.length === 0 ? (
        <p>No words added yet.</p>
      ) : (
        <ul>
          {vocabulary.map((word) => (
            <li key={word.id}>
              <strong>{word.spanish}</strong> — {word.english}

              <button type="button" onClick={() => word.id && handleEdit(word)}>
                Edit
             </button>

              <button type="button" onClick={() => word.id && handleDelete(word.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;