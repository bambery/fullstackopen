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

const App = () => {
    const courses = [
    {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            },
            {
                name: 'Redux',
                exercises: 11,
                id: 4
            }
        ]
    },
    {
        name: 'Node.js',
        id: 2,
        parts: [
            {
                name: 'Routing',
                exercises: 3,
                id: 1
            },
            {
                name: 'Middlewares',
                exercises: 7,
                id: 2
            }
        ]
    }
]


  return (
      <div>
          {courses.map( course =>
            <Course course={course} />
        )}
      </div>
  )
}

export default App;
