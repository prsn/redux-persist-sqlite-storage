import SQLiteStorage from '../index';

let SQLite = {};
let db = {};
beforeEach(() => {
  db = { transaction: () => {
      return {
        executeSql: (sql, param, sqlSuccess, sqlError) => {
          console.log(sql);
        }
      }
    }
  };
  SQLite.openDatabase = (config, success, error) => {
    success(db);
  }
});

test('initial db check', () => {
  console.log(SQLiteStorage(SQLite));
});