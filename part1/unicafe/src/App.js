import { useState } from 'react'

const Button = ({ onClick, text }) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const Stat = (props) => {
    const { name, amount} = props
    if (name == "positive"){
        return(
            <div>{name} {amount} %</div>
        )
    }
    return(
        <div>{name} {amount}</div>
    )

}

const Statistics = (props) =>{
    const { good, bad, neutral, allRatings, avg} = props
    if(allRatings > 0){
        return (
            <div>
                <Stat name="good" amount={good} />
                <Stat name="neutral" amount={neutral} />
                <Stat name="bad" amount={bad} />
                <Stat name="all" amount={allRatings} />
                <Stat name="average" amount={avg ? avg / allRatings : 0} />
                <Stat name="positive" amount={good ? (good / allRatings) * 100 : 0} />
            </div>
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
