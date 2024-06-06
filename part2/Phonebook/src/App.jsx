import { useState , useEffect} from 'react'
import serverCommunication from './serverCommunication'
import "./app.css"

const Filter = ({searchInput , handleSearch}) => {
  return(
    <div>
    filter shown with:<input type='text' value={searchInput} onChange={handleSearch}/>
    </div>
  )
}

const PersonForm = ({handleSubmit , newName , newNumber, handleNumChange , handleChange}) =>{
   return(
    <form onSubmit={handleSubmit}>
    <div>
      name:<input type='text' value={newName} onChange={handleChange}/>
    </div>
    <div>
      number:<input type='text' value={newNumber} onChange={handleNumChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
   )
}

const Persons = ({persons , searchInput, handleDelete}) =>{
  const notesToShow = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  person.number.toLowerCase().includes(searchInput.toLowerCase()))
  return(
    <ul>
    {
      notesToShow.map((person) =>(
        <li key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button></li>
      ))
    }
    </ul>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type === 'error' ? 'error' : 'success'}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber , setNewNumber] = useState("");
  const [searchInput, setSearchInput] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=>{
  serverCommunication.getAll()
  .then(person=>{
    setPersons(person)})
    .catch(error => {
      setErrorMessage('Failed to fetch persons from the server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }) 
  } , [])

  const handleSubmit = (e) =>{
    e.preventDefault()
    const doesNameExist = persons.find(person => person.name.toLowerCase()  === newName.toLowerCase() )
    if(doesNameExist){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        const updatedNumber= {...doesNameExist , number:newNumber}
        serverCommunication.update(doesNameExist.id , updatedNumber)
        .then(returnedPerson=>{
          setPersons(persons.map(prev => prev.id !==doesNameExist.id ? prev : returnedPerson))
          setSuccessMessage(`Updated ${doesNameExist.name}'s number`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber("")
        })
        .catch(error => {
          setErrorMessage(`'${doesNameExist.name}' couldn't be updated`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        }
      }
   else{
    const newPerson = { name: newName , number: newNumber }
    serverCommunication.create(newPerson)
    .then(person => {
      setPersons(prevPersons => [...prevPersons, person])
      setSuccessMessage(`Added ${person.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber("")
    })
    .catch(error => {
      setErrorMessage(`'${newPerson.name}' couldn't be added`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
    })
   }
    
  }
  

  const handleChange = (e) =>{
    setNewName(e.target.value)
    }
  
  const handleNumChange = (e) =>{
    setNewNumber(e.target.value)
  }

  const handleSearch= (e) =>{
    setSearchInput(e.target.value)
    }
 
   const handleDelete = (id) => {
    if(window.confirm("Do you really want to delete?")){
    serverCommunication.deletePerson(id)
    .then(person => {
        setPersons(deletePerson => deletePerson.filter(person => person.id !== id))
        setSuccessMessage(`Successfully deleted`)
        setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
    .catch(error => {
      setErrorMessage(`The person is already deleted, please reload the page.`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
    })
    }
   }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      <Filter searchInput={searchInput} handleSearch={handleSearch}/>
      <h2>add a new</h2>
       <PersonForm handleSubmit={handleSubmit} newName={newName} newNumber={newNumber} handleNumChange={handleNumChange} handleChange={handleChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} searchInput={searchInput} handleDelete={handleDelete}/>
    </div>
  )
}

export default App