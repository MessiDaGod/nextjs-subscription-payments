import {Action, configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query/react'
import thunk from 'redux-thunk';
import {
  supabaseApi,
  commUnitsReducer,
  commChargeSchedulesReducer,
  commLeasesReducer,
  commUnitXrefsReducer,
  commSQFTsReducer,
  commLeaseRecoveryParamsReducer,
  commOptionsReducer,
  sortStateReducer,
  commExcludesReducer,
  commRecoveryProfilesReducer,
  columnsInformationReducer,
} from './excelFileSlice'
import excelFileReducer from './excelFileSlice'
import {cellsReducer} from './cellsSlice'
import {layoutsReducer} from './layoutSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

export const store = configureStore({
  reducer: {
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    excelFile: excelFileReducer,
    commUnits: commUnitsReducer,
    commChargeSchedules: commChargeSchedulesReducer,
    commLeases: commLeasesReducer,
    commUnitXrefs: commUnitXrefsReducer,
    commSQFTs: commSQFTsReducer,
    commLeaseRecoveryParams: commLeaseRecoveryParamsReducer,
    commOptions: commOptionsReducer,
    cells: cellsReducer,
    layouts: layoutsReducer,
    sortState: sortStateReducer,
    commExcludes: commExcludesReducer,
    commRecoveryProfiles: commRecoveryProfilesReducer,
    columnsInformation: columnsInformationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(supabaseApi.middleware, thunk),
})

setupListeners(store.dispatch)

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    // we need it only on client side
    const persistConfig = {
      key: "nextjs",
      whitelist: ["auth"], // make sure it does not clash with server keys
      storage,
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== "production",
    });
    store.__persistor = persistStore(store); // Nasty hack
    return store;
  }
};


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
function rootReducer(state: unknown, action: Action<any>): unknown {
  throw new Error('Function not implemented.');
}

