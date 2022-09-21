import { useState } from 'react'

/*const MostVotes = ({ maxIndex, maxAnecdote, numVotes }) => {
    if(maxIndex !== null && maxIndex > -1){
        return (
            <div>
                <h1>Aphorism with most votes</h1>
                <div>{maxAnecdote}</div>
                <div>has {numVotes} votes</div>
            </div>

        )
    }

}
*/

const App = () => {
    // these are not anecdotes, they are aphorisms.
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
    ]

    const [selected, setSelected] = useState(0)
    const [points, setPoints] = useState( new Array(anecdotes.length).fill(0) )
    const handleClick = () => {
        setSelected( Math.floor(Math.random() * anecdotes.length) )
    }

    // it is not clear what should happen when the "vote" button is pressed. Should I allow the user to hit it multiple times? Should it generate a new aphorism? I am going to choose to allow the user to add as many votes as they like and have no other page action taken
    const tallyVotes = () => {
        const copy = [ ...points ]
        copy[selected] += 1
        setPoints(copy)
    }

    const maxIndex = points.indexOf(Math.max(...points))

    return (
        <div>
            <h1>Aphorism of the day</h1>
            <div>{anecdotes[selected]}</div>
            <div>has {points[selected]} votes</div>
            <button onClick={tallyVotes}>vote</button>
            <button onClick={handleClick}>next aphorism</button>
            <div>
                <h1>Aphorism with most votes</h1>
                <div>{anecdotes[maxIndex]}</div>
                <div>has {points[maxIndex]} votes</div>
            </div>
        </div>
    )
}

export default App;
