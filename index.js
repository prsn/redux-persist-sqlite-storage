/**
 * Store engine design to use SQLite DB to store key value pair.
 * This engine confirm to following AsyncStorage API
 * getItem(key);
 * setitem(key, value);
 * removeItem(key);
 * getAllKeys();
 * 
 * All the method above returns Promise object.
 */

const noop = () => {}

export function SQLiteStorage(SQLite = {}, config = {}) {
  let database = null;
  const defaultConfig = {
    name: 'sqlite-storage',
    location: 'default'
  };

  SQLite.openDatabase({...defaultConfig, ...config}, (db) => {
    database = db;
    database.transaction( tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS store (key, value)`);
    }, error => console.log('Unable to create table', error));
  }, error => console.log('Unable to open database', error));

  function getItem(key, cb = noop) {
    return new Promise((resolve, reject) => {
      if (database === null) {
        reject('Database not opened yet');
      }
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
      if (database === null) {
        reject('Database not opened yet');
      }
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT count(*) as count FROM store WHERE key=?',
          [key],
          (tx, rs) => {
            if (rs.rows.item(0).count == 1) {
              // execute update statement
              tx.executeSql(
                'UPDATE store SET value=? WHERE key=?',
                [value, key],
                () => resolve(value),
                (tx, err) => reject('updation failed', err)
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
      console.log('persist: removeItem called');
      if (database === null) {
        reject('Database not opened yet');
      }
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM store WHERE key=?', [key],
          () => {
            resolve(`${key} removed from store`);
            cb(null, `${key} removed from store`);
          },
          (tx, err) => {
            reject('unable to remove key', err);
          }
        );
      });
    });
  }
  
  function getAllKeys(cb = noop) {
    return new Promise((resolve, reject) => {
      console.log('persist: getAllKeys called');
      if (database === null) {
        reject('Database not opened yet');
      }
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
            reject('unable to remove key', err);
          }
        );
      });
    });
  }

  return {
    getItem,
    setItem,
    removeItem,
    getAllKeys
  }
};
