import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState(" ");
  const [newNumber, setNewNumber] = useState();

  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");

    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const peopleToShow = newFilter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
    : persons;

  function addName(event) {
    event.preventDefault();

    let checkNameExists = persons.filter((person) => person.name === newName);
    let checkNumberExists = persons.filter(
      (person) => person.number === newNumber
    );

    if (checkNameExists.length === 0 && checkNumberExists.length === 0) {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };

      axios
        .post("http://localhost:3001/persons", newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewNumber("");
        });

      setPersons(persons.concat(newPerson));
    } else if (checkNameExists.length === !0) {
      alert(`${newName} is already added to the phonebook`);
      return;
    } else {
      alert(`${newNumber} is already added to the phonebook`);
      return;
    }

    setNewName(" ");
    setNewNumber(" ");
  }

  function handleNameChange(event) {
    setNewName(event.target.value);
  }

  function handleNumberChange(event) {
    setNewNumber(event.target.value);
  }

  function handleFilterChange(event) {
    setNewFilter(event.target.value);
  }

  const handleDelete = (id) => {
    peopleToShow.find((person) => {
      return window.confirm(`delete ${person.name}?`);
    });

    const filterPerson = peopleToShow.filter((person) => {
      return person.id !== id;
    });
    setPersons(filterPerson);
  };

  return (
    <div className="App">
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={newFilter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name : <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number : <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Number</h2>
      <ul>
        {peopleToShow.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </p>
        ))}
      </ul>
    </div>
  );
}

export default App;
