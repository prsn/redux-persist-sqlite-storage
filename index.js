/**
 * SQLite store adaptor designed to use with redux-persist. This small piece of code can also be used
 * as an interface between application and SQLite storage. Functions signature are same as AsyncStorage.
 * 
 * getItem(key);
 * setitem(key, value);
 * removeItem(key);
 * getAllKeys();
 * clear();
 * 
 * All the method above returns Promise object.
 */

const noop = () => {}
const rejectPromise = () => new Promise((resolve, reject) => {
  reject('Operation is not allowed when DB is closed!')
});
const nullDB = {
  getItem: rejectPromise,
  setItem: rejectPromise,
  removeItem: rejectPromise,
  getAllKeys: rejectPromise,
  clear: rejectPromise
}

export default function SQLiteStorage(SQLite = {}, config = {}) {
  let database = null;
  const defaultConfig = {
    name: 'sqlite-storage',
    location: 'default'
  };

  function getItem(key, cb = noop) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT value FROM store WHERE key=?', [key],
          (tx, rs) => {
            resolve(rs.rows.item(0).value);
            cb(null, rs.rows.item(0).value);
          },
          (tx, err) => {
            cb(err);
            reject('unable to get value', err);
          }
        );
      });
    });
  }
  
  function setItem(key, value, cb = noop) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT count(*) as count FROM store WHERE key=?',
          [key],
          (tx, rs) => {
            if (rs.rows.item(0).count == 1) {
              tx.executeSql(
                'UPDATE store SET value=? WHERE key=?',
                [value, key],
                () => resolve(value),
                (tx, err) => reject('unable to set value', err)
              );
            } else {
              tx.executeSql(
                'INSERT INTO store VALUES (?,?)', [key, value],
                () => {
                  resolve(value);
                },
                (tx, err) => {
                  reject('unable to set value', err);
                }
              );
            }
          }
        );
      });
    });
  }
  
  function removeItem(key, cb = noop) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM store WHERE key=?', [key],
          () => {
            resolve(`${key} removed from store`);
            cb(null, `${key} removed from store`);
          },
          (tx, err) => {
            reject('unable to remove key', err);
            cb(err, 'unable to remove key');
          }
        );
      });
    });
  }
  
  function getAllKeys(cb = noop) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM store', [],
          (tx, rs) => {
            const result = [];
            for( let i = 0, il = rs.rows.length; i < il; i++) {
              result.push(rs.rows.item(i).key);
            }
            resolve(result);
            cb(null, result);
          },
          (tx, err) => {
            resolve([]);
            cb(null, []);
          }
        );
      });
    });
  }

  function clear(cb = noop) {
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql('DELETE FROM store', [], () => {
          resolve(null);
          cb(null);
        }, (tx, err) => {
          reject(err);
          cb(err);
        });
      })
    });
  }

  let api = {
    getItem,
    setItem,
    removeItem,
    getAllKeys,
    clear
  }
  
  database = SQLite.openDatabase({...defaultConfig, ...config}, (db) => {
    database.transaction( tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS store (key, value)`);
    }, error => {
      api = nullDB;
      console.warn('Unable to create table', error);
    });
  }, error => {
    api = nullDB;
    console.warn('Unable to open database', error)
  });
  

  return {
    getItem: (...args) => api.getItem(...args),
    setItem: (...args) => api.setItem(...args),
    removeItem: (...args) => api.removeItem(...args),
    getAllKeys: (...args) => api.getAllKeys(...args),
    clear: (...args) => api.clear(...args)
  }
};
