import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

describe('anecdoteReducer', () => {
    test('returns new state with action NEW_ANECDOTE', () => {
        const state = []
        const action = {
            type: 'NEW_ANECDOTE',
            data: {
                content: 'these are not anecdotes',
            }
        }

        deepFreeze(state)
        const newState = anecdoteReducer(state, action)

        expect(newState).toHaveLength(1)
        const newAnecdote = { 'votes': 0, 'content': action.data.content }
        expect(newState[0]).toEqual(expect.objectContaining(newAnecdote))
    })
})
