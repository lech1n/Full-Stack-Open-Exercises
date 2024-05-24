import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const n = anecdotes.length
  const arr = Array(n).fill(0)
  const [array , setArray] = useState(arr)

  const handleClick = () =>{
    let x = Math.floor(Math.random() * n)
    setSelected(x)
  }

  const handleVote = () =>{
   const copy = [...array]
   copy[selected] += 1
   setArray(copy)
  }

  const largestElement = Math.max(...array)
  const largestElementIndex = array.indexOf(largestElement)
  
  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>Has {array[selected]} votes</p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleClick}>Next anecdote</button>
      <h1>Anecdote with the most votes</h1>
      {largestElement === 0 ? (<p>Please Vote</p> )
      :
      (
       <div>
      <p>{anecdotes[largestElementIndex]}</p>
      <p>has {largestElement} votes</p>
      </div>
      )}
      
    </div>
  )
}

export default App