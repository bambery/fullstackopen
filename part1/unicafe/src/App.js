import { useState } from 'react'

const Button = ({ onClick, text }) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const StatisticLine = (props) => {
    const { text, value} = props
    if (text == "positive"){
        return(
            <tr>
                <td>{text}</td> 
                <td>{value} %</td>
            </tr>
        )
    }
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )

}

const Statistics = (props) =>{
    const { good, bad, neutral, allRatings, avg} = props
    if(allRatings > 0){
        return (
            <table>
                <tbody>
                    <StatisticLine text="good" value={good} />
                    <StatisticLine text="neutral" value={neutral} />
                    <StatisticLine text="bad" value={bad} />
                    <StatisticLine text="all" value={allRatings} />
                    <StatisticLine text="average" value={avg ? avg / allRatings : 0} />
                    <StatisticLine text="positive" value={good ? (good / allRatings) * 100 : 0} />
                </tbody>
            </table>
        )
    }
    return (
        <div>
            No feedback given
        </div>

    )

}

function App() {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [allRatings, setAll] = useState(0)
    const [avg, setAvg] = useState(0)

    const handleGoodClick = () => {
        setAll(allRatings + 1)
        setGood(good + 1)
        setAvg(avg + 1)
    }

    const handleNeutralClick = () => {
        setAll(allRatings + 1)
        setNeutral(neutral + 1)
    }

    const handleBadClick = () => {
        setAll(allRatings + 1)
        setBad(bad + 1)
        setAvg(avg - 1)
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text="good" />
            <Button onClick={handleNeutralClick} text="neutral" />
            <Button onClick={handleBadClick} text="bad" />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} allRatings={allRatings} avg={avg}/>
        </div>
    )
}

export default App;
