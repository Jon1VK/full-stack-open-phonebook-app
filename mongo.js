if (process.argv.length < 3) {
  console.log("give password as first argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://admin:${password}@cluster0.1som2.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const mongoose = require("mongoose");

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    name,
    number,
  });

  person.save().then((person) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Phonebook:");

  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
