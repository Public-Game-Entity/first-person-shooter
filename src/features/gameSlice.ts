import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isStart: false,
    isGameOver: false
}

const galeSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setStart(state, action) {
            state.isStart =  action.payload.isStart
        },
        setGameOver(state, action) {
            state.isGameOver =  action.payload.isGameOver
        }
    }
})

export const { setStart, setGameOver } = galeSlice.actions
export default galeSlice.reducer