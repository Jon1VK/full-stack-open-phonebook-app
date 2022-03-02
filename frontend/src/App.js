import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const nullNotification = { isError: false, message: null };
const TIMEOUT_MS = 5000;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [notification, setNotification] = useState(nullNotification);

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const createNotification = (isError, message) => {
    setNotification({ isError, message });
    setTimeout(() => setNotification(nullNotification), TIMEOUT_MS);
  };

  const createPerson = (person) => {
    personService.create(person).then((createdPerson) => {
      setPersons(persons.concat(createdPerson));
      createNotification(false, `Added ${createdPerson.name}`);
    });
  };

  const updatePerson = (id, person) => {
    personService
      .update(id, person)
      .then((updatedPerson) => {
        setPersons(
          persons.map((person) => (person.id !== id ? person : updatedPerson))
        );
        createNotification(false, `Updated ${updatedPerson.name}`);
      })
      .catch(() => {
        setPersons(persons.filter((person) => person.id !== id));
        createNotification(
          true,
          `Information of ${person.name} has already been removed from server`
        );
      });
  };

  const addPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    setNewName("");
    setNewNumber("");

    const id = persons.find((person) => person.name === newPerson.name)?.id;

    const shouldUpdatePerson =
      id !== undefined &&
      window.confirm(
        `${newPerson.name} is already added to phonebook, replace old number with a new one?`
      );

    if (shouldUpdatePerson) {
      updatePerson(id, newPerson);
    } else {
      createPerson(newPerson);
    }
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .destroy(person.id)
        .then(() => {
          setPersons(
            persons.filter((otherPerson) => otherPerson.id !== person.id)
          );
          createNotification(false, `Deleted ${person.name}`);
        })
        .catch(() => {
          setPersons(
            persons.filter((otherPerson) => otherPerson.id !== person.id)
          );
          createNotification(
            true,
            `Information of ${person.name} has already been removed from server`
          );
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(nameQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        isError={notification.isError}
        message={notification.message}
      />

      <Filter
        value={nameQuery}
        onChange={(event) => setNameQuery(event.target.value)}
      />

      <h3>add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handlePersonDeletion={deletePerson} />
    </div>
  );
};

export default App;
