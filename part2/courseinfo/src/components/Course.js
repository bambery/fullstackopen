const Header = ({ name }) => {
    return (
        <div>
            <h1>{name}</h1>
        </div>
    )
}

const Content = ({ parts }) => {
    return(
        <div>
            <ul>
                {parts.map(part => 
                    <Part key={part.id} part={part} />
                )}
            </ul>
        </div>
    )
}

const Part = ({ part }) => {
    return (
        <li key = {part.id}>
            {part.name} {part.exercises}
        </li>
    )
}

const Course = ({ course }) =>{
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

const Total = ({ parts }) => {
    return(
        <div> 
            <b>
                total of {parts.reduce(
                    (prev, curr) => prev + curr.exercises,
                    0
                )} exercises
            </b>
        </div>
    )
}

export default Course
