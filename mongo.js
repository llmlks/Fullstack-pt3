const mongoose = require('mongoose')
const url = MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const args = process.argv

if (args.length == 4) {
    const person = new Person({
        name: args[2],
        number: args[3]
    })
    person
        .save()
        .then(response => {
            console.log(`Lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(persons => {
            console.log('puhelinluettelo:')
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}