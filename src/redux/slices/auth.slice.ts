import { createSlice } from '@reduxjs/toolkit'

interface IState {
  isSignin: boolean
  access_token: string | null
}

const initialState: IState = {
  isSignin: false,
  access_token: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStateSignin: (state, action: { payload: boolean }) => {
      state.isSignin = action.payload
    },
    setAccessToken: (state, action: { payload: string | null }) => {
      state.access_token = action.payload
    }
  }
})

export const { setStateSignin, setAccessToken } = authSlice.actions

export default authSlice.reducer
