import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class DbService {
  db: SQLiteObject;
  public dataInsertStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public dataScan: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
      private sqlite: SQLite,
      private storage: Storage,
      private platform: Platform // Inject Platform service
  ) {
    console.log(this.platform);
    this.platform.ready().then(() => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        // Only initialize the database on a mobile platform
        this.createDataBase();
      } else {
        console.log('SQLite is not available on this platform.');
      }
    });
  }

  // sqlite Database create

  async createDataBase() {
    try {
      await this.sqlite.create({
        name: 'teamDesk.db',
        location: 'default'
      }).then(async (db: SQLiteObject) => {
        this.db = db;
        console.log("db------->>>>>", db);
        await Promise.all([
          this.createTable(),
          this.createDropOffTable()
        ]);
      }).catch((err: any) => {
        console.error('Error creating database:', err);
      });
    } catch (err) {
      console.error('Error creating database:', err);
    }
  }

  createTable() {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="collection"', [])
          .then(async (data) => {
            if (data.rows.length === 0) {
              // Table doesn't exist, create it
              this.db.executeSql('CREATE TABLE IF NOT EXISTS collection(id INTEGER PRIMARY KEY AUTOINCREMENT, practiceId TEXT, Status TEXT, details TEXT, location TEXT, image TEXT,date TEXT)')
                .then(async (res) => {
                  await this.checkLocationColumn();
                  resolve(res);
                })
                .catch((err) => {
                  console.log('Error during SQL execution:', err);
                  // alert('Error during SQL execution: ' + JSON.stringify(err));
                  reject({ err: err });
                });
            } else {
              // Table already exists
              await this.checkLocationColumn();
              resolve(data);
            }
          })
          .catch((err) => {
            console.log('Error checking if table exists:', err);
            alert('Error checking if table exists: ' + JSON.stringify(err));
            reject({ err: err });
          });
      } catch (err) {
        alert(" catch not created")
        console.log('Catch block error:', err);
        reject({ err: err });
      }
    });

  }
  createDropOffTable() {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="drop_off"', [])
          .then(async (data) => {
            if (data.rows.length === 0) {
              // Table doesn't exist, create it
              this.db.executeSql('CREATE TABLE IF NOT EXISTS drop_off(id INTEGER PRIMARY KEY AUTOINCREMENT, practiceId TEXT, details TEXT, location TEXT, image TEXT,date TEXT)')
                .then(async (res) => {
                  // await this.checkLocationColumn();
                  resolve(res);
                })
                .catch((err) => {
                  console.log('Error during SQL execution:', err);
                  // alert('Error during SQL execution: ' + JSON.stringify(err));
                  reject({ err: err });
                });
            } else {
              // Table already exists
              // await this.checkLocationColumn();
              resolve(data);
            }
          })
          .catch((err) => {
            console.log('Error checking if table exists:', err);
            alert('Error checking if table exists: ' + JSON.stringify(err));
            reject({ err: err });
          });
      } catch (err) {
        alert(" catch not created")
        console.log('Catch block error:', err);
        reject({ err: err });
      }
    });

  }
  checkLocationColumn() {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql('PRAGMA table_info(collection)', [])
          .then((data) => {
            let locationColumnExists = false;
            let dateColumnExists = false;
            for (let i = 0; i < data.rows.length; i++) {
              const column = data.rows.item(i);
              if (column.name === 'location') {
                locationColumnExists = true;
              }
              if (column.name === 'date') {
                dateColumnExists = true;
                break;
              }
            }

            if (!locationColumnExists) {
              // Location column doesn't exist, add it
              this.db.executeSql('ALTER TABLE collection ADD COLUMN location TEXT', [])
                .then((res) => {
                  resolve(res);
                })
                .catch((err) => {
                  console.log('Error adding location column:', err);
                  alert('Error adding location column: ' + JSON.stringify(err));
                  reject({ err: err });
                });
            }
            if (!dateColumnExists) {
              this.db.executeSql('ALTER TABLE collection ADD COLUMN date TEXT', [])
                .then(() => {
                  console.log('Added date column');
                })
                .catch((err) => {
                  console.log('Error adding date column:', err);
                  alert('Error adding date column: ' + JSON.stringify(err));
                  reject({ err: err });
                });
            }
            resolve(data);
          })
          .catch((err) => {
            console.log('Error checking location column:', err);
            alert('Error checking location column: ' + JSON.stringify(err));
            reject({ err: err });
          });
      } catch (err) {
        console.log('Catch block error:', err);
        alert('Catch block error: ' + JSON.stringify(err));
        reject({ err: err });
      }
    });
  }


  insertRecord(serializedArray: any) {
    return new Promise((resolve, reject) => {
      try {
        let query: string = 'INSERT INTO collection (practiceId, Status, details, location, image,date) VALUES (?, ?, ?, ?, ?,?)';
        let values = [
          serializedArray[0].practiceId,
          serializedArray[0].Status,
          serializedArray[0].details,
          serializedArray[0].Location,
          serializedArray[0].image?.length > 0 ? typeof serializedArray[0].image == 'string' ? serializedArray[0].image : JSON.stringify(serializedArray[0].image) : [],
          serializedArray[0].date
        ];
        this.db.executeSql(query, values).then((res) => {
          this.dataInsertStatus.next(true);
          this.storage.remove("outbox");
          // localStorage.removeItem("outbox");
          return resolve(true);
        }).catch((err) => {
          console.log('Error:', err);
          alert(JSON.stringify(err));
          this.dataInsertStatus.next(true);
          return reject({ err: err });

        });

      } catch (err) {
        this.dataInsertStatus.next(true);
        alert(JSON.stringify(err));
        return reject({ err: err });
      }
    })

  }
  insertDropOffRecord(serializedArray: any) {
    return new Promise((resolve, reject) => {
      try {
        let query: string = 'INSERT INTO drop_off (practiceId,details, location,image,date) VALUES (?, ?, ?, ?, ?)';
        let values = [
          serializedArray[0].practiceId,
          serializedArray[0].details,
          serializedArray[0].Location,
          serializedArray[0].image?.length > 0 ? typeof serializedArray[0].image == 'string' ? serializedArray[0].image : JSON.stringify(serializedArray[0].image) : [],
          serializedArray[0].date
        ];
        console.log("-------------------", query, values)
        this.db.executeSql(query, values).then((res) => {
          this.dataInsertStatus.next(true);
          this.storage.remove("drop_off");
          return resolve(true);
        }).catch((err) => {
          console.log('Error:', err);
          alert(JSON.stringify(err));
          this.dataInsertStatus.next(true);
          return reject({ err: err });

        });

      } catch (err) {
        this.dataInsertStatus.next(true);
        alert(JSON.stringify(err));
        return reject({ err: err });
      }
    })

  }
  async openDatabaseConnection(): Promise<SQLiteObject> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'teamDesk.db', // Replace with your database name
        location: 'default',
      });

      await db.open();

      return db; // Return the SQLiteObject for database operations
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }

  getCollectionData() {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM collection';
      return await this.db.executeSql(query, []).then(async (res: any) => {
        if (res.rows.length > 0) {
          return resolve(res)
        } else {
          res.rows = [];
          return resolve(res)
        }

      }).catch((err) => reject(err))
    })
  }
  getDropOffData() {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM drop_off';
      return await this.db.executeSql(query, []).then(async (res: any) => {
        if (res.rows.length > 0) {
          return resolve(res)
        } else {
          res.rows = [];
          return resolve(res)
        }

      }).catch((err) => reject(err))
    })
  }
  async deleteCollectionData() {
    const query = `DELETE FROM collection`;
    await this.db.executeSql(query, []).then(async (res: any) => {
      console.log('delete all recorded res: ', res)
      this.dataInsertStatus.next(true);

    });
  }
  async deleteDropOffData() {
    const query = `DELETE FROM drop_off`;
    await this.db.executeSql(query, []).then(async (res: any) => {
      console.log('delete all recorded res: ', res)
      this.dataInsertStatus.next(true);

    });
  }

  async deleteCollectionDataById(id: number) {
    const query = `DELETE FROM collection where id=${id}`;
    return await this.db.executeSql(query, []).then(async (res: any) => {
      console.log('delete all recorded res: ', res)
      this.dataInsertStatus.next(true);
      return true

    });
  }
}
