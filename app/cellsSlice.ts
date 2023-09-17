import {createSlice, PayloadAction, EntityState, createAsyncThunk, createEntityAdapter, EntityId} from '@reduxjs/toolkit'
import {RootState} from './store'
import type {Cell, Row} from '@/components/utils'

const cellAdapter = createEntityAdapter({
  selectId: (entity: Partial<Row>) => `${entity.rowIndex}:${entity.columnIndex}`,
})

const cellsSlice = createSlice({
  name: 'cells',
  initialState: cellAdapter.getInitialState({
    isHovered: false,
    activeCell: {},
  }),
  reducers: {
    cellUpdated: cellAdapter.updateOne,
    upsertOne: (state, action: PayloadAction<Partial<Row>>) => {
      cellAdapter.upsertOne(state, action.payload);
    },
    setIsHovered: (state, action: PayloadAction<boolean>) => {
      state.isHovered = action.payload
    },
    setActiveCell: (state, action: PayloadAction<Partial<Cell>>) => {
      state.activeCell = action.payload
    },
  },
});

const cellSelectors = cellAdapter.getSelectors<RootState>((state) => state.cells);

export const {selectAll: selectAllCells} = cellSelectors

export const {cellUpdated, upsertOne, setIsHovered, setActiveCell} = cellsSlice.actions

export const cellsReducer = cellsSlice.reducer
