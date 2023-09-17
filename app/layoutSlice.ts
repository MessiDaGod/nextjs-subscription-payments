import {createSlice, PayloadAction, EntityState, createAsyncThunk, createEntityAdapter, EntityId} from '@reduxjs/toolkit'
import type {Cell, Row} from '@/components/utils'

const layoutAdapter = createEntityAdapter({
  selectId: (entity: Partial<Row>) => `${entity.rowIndex}:${entity.columnIndex}`,
})

const layoutsSlice = createSlice({
  name: 'layouts',
  initialState: layoutAdapter.getInitialState({
    collapsed: false,

  }),
  reducers: {
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload
    },
  },
});

export const {setCollapsed} = layoutsSlice.actions

export const layoutsReducer = layoutsSlice.reducer
