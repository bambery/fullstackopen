const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

const createTestUser = async (testUsername, testPass) => {
    await User.deleteMany({})

    saltRounds = 10
    passwordHash = await bcrypt.hash(testPass, saltRounds)

    const user = new User({
        username: testUsername,
        name: 'Test User',
        passwordHash : passwordHash,
    })

    const savedUser = await user.save()
    return savedUser.toJSON
}

// returns login token
// fso why did you tell me this was an exercise for the reader? Am I supposed to look ahead to find out how you solve this for your tests?
const logUserIn = async (username, userId) => {
    const userForToken = {
        username: username,
        id: userId
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    return token
}

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    await note.save()
    await note.remove()

    return note.id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map( u => u.toJSON())
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb,
    createTestUser,
    logUserIn,
}
