import { createSlice } from '@reduxjs/toolkit'

interface IState {
  isOpenDrawer: boolean
}

const initialState: IState = {
  isOpenDrawer: true
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setStateDrawer: (state) => {
      state.isOpenDrawer = !state.isOpenDrawer
    }
  }
})

export const { setStateDrawer } = cartSlice.actions

export default cartSlice.reducer
