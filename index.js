const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.set('json spaces', 4)

morgan.token('body', req => JSON.stringify(req.body))

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/info', (req, res) => {
    const date = new Date()
    Person
        .find({})
        .then(persons => {
            res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
            <p>${date}</p>`)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    const number = body.number

    if (name === undefined || number === undefined || name.length === 0 || number.length === 0) {
        return res.status(400).json({
            error: `Name: ${body.name}, number: ${body.number}.
                     Name and number must both be defined`
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    person
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'name must be unique ' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(res.status(204).end())
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id ' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    const options = { new: true }

    Person
        .findByIdAndUpdate(req.params.id, person, options)
        .then(response => {
            res.json(Person.format(response))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})