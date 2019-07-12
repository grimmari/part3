const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@react-1-6zwkm.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Item', personSchema)

if (process.argv[3]) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
        })
    
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phobook`);
        mongoose.connection.close();
    })
} else {
    Person.find({}).then(result => {
        console.log('phobook:')
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}
/*
const person = new Person({
    name: 'Möttis',
    number: '154788'
    })

person.save().then(response => {
    console.log('person saved!');
    mongoose.connection.close();
})
*/
