/* eslint-disable import/no-cycle */
/* eslint-disable import/no-import-module-exports */
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import { STORAGE_KEY } from 'globalConstants/rootConstants';
import { rootReducer } from './rootReducer';

const persistConfig = {
  key: STORAGE_KEY,
  storage,
  loading: false,
  version: 1,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configuredStore = (preloadedState?: undefined) => {
  const loggerMiddleware = createLogger();
  const defaultMiddlewareOptions = {
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  };
  // Create Store
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV !== 'production'
        ? getDefaultMiddleware(defaultMiddlewareOptions).concat(
            loggerMiddleware
          )
        : getDefaultMiddleware(defaultMiddlewareOptions),
    preloadedState,
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./rootReducer', () =>
      store.replaceReducer(persistedReducer)
    );
  }
  return store;
};

const store = configuredStore();
const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
