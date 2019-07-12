require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')


const Person = require('./models/person')

app.use(express.static('build'))

app.use(bodyParser.json())
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
//app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
//morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

const cors = require('cors')
app.use(cors())

app.get('/', (request, response) => {

    response.send("hello")
})
app.get('/info', (request, response) => {
    var personLenght = persons.length.toString()
    var info = 'Phonebook has info for ' + personLenght + ' people'
    var currentTime = new Date()
    var message = info + '<br>' + currentTime

    response.send(message)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))

})
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
            console.log('success delete')
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})





app.post('/api/persons', (request, response,next) => {

    const body = request.body

    //morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }



    const person = new Person({
        name: body.name,
        number: body.number,

    })

    person.save().then(savedPerson => {
        console.log(`added ${person.name}, ${person.number} to phobook`);
        response.json(savedPerson.toJSON())
    })
    .catch(error=>next(error))

})




const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {

        return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name==='ValidationError'){
        return response.status(409).send(error.message )
    }
   

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})