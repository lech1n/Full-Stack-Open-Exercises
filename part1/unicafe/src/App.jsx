import { useState } from 'react'

const StatisticLine = ({text , value}) =>{
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good , neutral , bad}) =>{
  const total = good + neutral + bad
  const average =  (good - bad) / total
  const positive = (good / total) * 100 
  return(
    <>
    <h1>Statistics</h1>
    <div>
    {total === 0 ? 
    (
    <p>No feedback given</p>
    ):(
     <table>
      <tbody>
      <StatisticLine text={"Good"} value={good}/>
      <StatisticLine text={"Neutral"} value={neutral}/>
      <StatisticLine text={"Bad"} value={bad}/>
      <StatisticLine text={"Total"} value={total}/>
      <StatisticLine text={"Average"} value={average}/>
      <StatisticLine text={"Positive"} value={positive}/>
     </tbody>
     </table>
     )
    }
    </div>

    </>
  )
}

const Button = ({handleClick, name}) =>{
   return(
    <button onClick={handleClick}>{name}</button>
   )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(prev => prev + 1)} name={"Good"}/>
      <Button handleClick={() => setNeutral(prev => prev + 1)} name={"Neutral"}/>
      <Button handleClick={() => setBad(prev => prev + 1)} name={"Bad"}/>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App