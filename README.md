# redux-persist-sqlite-storage

A redux-persist store adaptor which uses SQLite database to persist store.

# Motivation

By default redux-persist uses `AsyncStorage` as storage engine in react-native. This is a drop-in replacemet of `AsyncStorage`.

The library is inspired by `react-native-sqlite-storage`.

# Install
```bash
npm install --save redux-persist-sqlite-storage
```

Please do follow the installation steps to install `react-native-sqlite-storage`.

# Usages
First configure SQLite from below link
1. https://github.com/andpor/react-native-sqlite-storage

Follow below steps after you have successfully configured the SQLite

```Javascript
import SQLiteStorage from 'redux-persist-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
// Considering SQLite object is defined / imported

// Pass any valid configuration as `config` parameter applied to react-native-sqlite-storage as per above link
const storeEngine = SQLiteStorage(SQLite, config);

// Now pass the storeEngine as value of store while configuring redux-persist

const persistConfig = {
  ...
  store: storeEngine
}

```

Please note that, the `config` object will take any valid configuration as accepted by `react-native-sqlite-storage`.
The default configuration only consider `name` and `location`

```Javascript
const defaultConfig = {
  name: 'sqlite-storage',
  location: 'default'
};
```

The object return by `SQLiteStorage` function has 5 methods and each of the method returns `Promise` as well as callback upon completion of any operation (compatable with redux-persist 5.x.x version)

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
```Javascript
clear([callback]: ?(error: ?Error) => void)
```

Above methods confirms to `AsyncStorage` method signatures

# Tested under following enviornments
Examples are located at `examples\rn` directory

1. `redux-persist@4.5.0`
2. `redux-persist@5.9.1`

# Future enhancements
Will support all of the methods supported by AsyncStorage.
