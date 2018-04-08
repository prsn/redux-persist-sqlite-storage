import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import todoReducer from './reducers/todo-reducers';
// import storage from 'redux-persist/lib/storage';
import SQLite from 'react-native-sqlite-storage';
import SQLiteStorage from 'redux-persist-sqlite-storage';

const storeEngine = SQLiteStorage(SQLite);
// import logger from 'redux-logger';
const logger = createLogger({
  collapsed: true,
  duration: true,
  logErrors: true
});

SQLite.DEBUG(true);
SQLite.enablePromise(true);


const persistConfig = {
  storage: storeEngine,
  debug: true
};
// const persistedReducer = persistReducer(persistConfig, todoReducer);
// let store = createStore(persistedReducer, {}, applyMiddleware([thunk, logger]));

const store = createStore(
  todoReducer,
  undefined,
  compose(applyMiddleware(thunk, logger),
  autoRehydrate())
);
const persistor = persistStore(store, {storage: storeEngine}, () => console.log('hi'));
export default store;
