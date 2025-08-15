import { createSlice } from '@reduxjs/toolkit'

interface IState {
  IdCartUser?: string
  selectedItems: string[]
}

const initialState: IState = {
  IdCartUser: '',
  selectedItems: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIdCartUser: (state, action) => {
      state.IdCartUser = action.payload
    }
  }
})

export const { setIdCartUser } = cartSlice.actions

export default cartSlice.reducer
