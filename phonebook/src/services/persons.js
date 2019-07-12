import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  
  const promise = axios.get(baseUrl)

  return promise.then(response => response.data)
}

const create = (person) => {
  console.log(baseUrl)
  console.log(person.name)
  console.log(person.number)
  
  const promise = axios.post(baseUrl, person)
console.log('Data was send')
  return promise.then(response => response.data)
}

const remove = (id) => {
  const promise = axios.delete(`${baseUrl}/${id}`)

  return promise.then(response => response.data)
}

const replace = (person) => {
  const promise = axios.put(`${baseUrl}/${person.id}`, person)

  return promise.then(response => response.data)
}

export default {
  getAll, create, remove, replace
}