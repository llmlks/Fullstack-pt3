const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.set('json spaces', 4)

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Arto Jarvinen',
        number: '040-123456',
        id: 3
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
    }
]

const generateId = () => {
    const max = 1000000
    return Math.floor(Math.random() * max)
}

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                <p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
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
    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: `${body.name} has already been added to phonebook`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})