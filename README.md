# redux-persist-sqlite-storage

A redux-persist store engine that uses SQLite database to persist store.

# Motivation

By default redux-persist uses `AsyncStorage` as storage engine. Any RN apps which has huge data, experience performance issue a lot.
This is a work around to overcome AsyncStorage performance limitaton in RN applications.

Foundation of this library is based on Chris Brody's `Cordova SQLite plugin` and `react-native-sqlite-storage`.

# Instal
```bash
npm install --save redux-persist-sqlite-storage
```

# Usages
First configure SQLite from below links based on your requirement
1. https://github.com/andpor/react-native-sqlite-storage - react-native
2. https://github.com/litehelpers/Cordova-sqlite-storage

Follow below steps after you have successfully configured the SQLite

```Javascript
import SQLiteStorage from 'redux-persist-sqlite-storage';

// Considering SQLite object is configured

// Pass config any valid configuration applied to SQLite based as per above 2 links
const storeEngine = SQLiteStorage(SQLite, config);

// Now pass the storeEngine as value of store while configuring redux-persist

const persistConfig = {
  ...
  store: storeEngine
}

```

Please note that, the `config` object will take any valid configuration as accepted by `Cordova-sqlite-storage`.
The default configuration only consider `name` and `location`

```Javascript
const defaultConfig = {
  name: 'sqlite-storage',
  location: 'default'
};
```

The object return by `SQLiteStorage` function has 4 methods and each of the method returns `Promise` as well as call callback upon completion of any operation (compatable with redux-persist 5.x.x version)

Following functions are supported

```Javascript
getItem(key: string, [callback]: ?(error: ?Error, result: ?string) => void)
```
```Javascript
setitem(key: string, value: string, [callback]: ?(error: ?Error) => void)
```
```Javascript
removeItem(key: string, [callback]: ?(error: ?Error) => void)
```
```Javascript
getAllKeys([callback]: ?(error: ?Error, keys: ?Array<string>) => void)
```

Above methods confirms to `AsyncStorage` method signatures

# Future enhancements
Will support all of the methods supported by AsyncStorage.
