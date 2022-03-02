const Persons = ({ persons, handlePersonDeletion }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name} {person.number}{" "}
        <button onClick={() => handlePersonDeletion(person)}>delete</button>
      </li>
    ))}
  </ul>
);

export default Persons;
