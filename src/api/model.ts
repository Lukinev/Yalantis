import sqlite3 from "sqlite3";

let db = new sqlite3.Database("./data/yalantis.db", sqlite3.OPEN_READWRITE);

interface ISelectQuery {
  query: string;
  params?: object;
}

export interface IUserProfile {
  $NAME: string;
  $SURNAME: string;
  $EMAIL: string;
  $PHOTO?: string;
  $ID?: number;
}

async function selectQuery(query: ISelectQuery) {
  return await new Promise((resolve, reject) => {
    db.all(query.query, query.params, function (err: any, rows: any) {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

async function runQuery(query: ISelectQuery) {
  return await new Promise((resolve, reject) => {
    db.run(query.query, query.params, function (err: any, rows: any) {
      if (err) {
        reject(err);
      }
      resolve(0);
    });
  });
}

export function getUsersProfilesList() {
  let obj = new Object() as ISelectQuery;
  obj.query = `select
                    up.ID,
                    up.NAME,
                    up.SURNAME,
                    up.EMAIL, 
                    up.PHOTO
                from userProfiles up`;
  return selectQuery(obj);
}

export function getUserProfile(id: number) {
  let obj = new Object() as ISelectQuery;
  obj.query = `select
                    up.ID,
                    up.NAME,
                    up.SURNAME,
                    up.EMAIL, 
                    up.PHOTO
                from userProfiles up where up.ID = $ID`;
  obj.params = { $ID: id };
  return selectQuery(obj);
}

export async function deleteUserProfile(profileID: number) {
  let obj = new Object() as ISelectQuery;
  obj.query = `delete from userProfiles where ID = $ID;`;
  obj.params = { $ID: profileID };
  return await runQuery(obj);
}

export async function insUserProfile(profile: IUserProfile) {
  let obj = new Object() as ISelectQuery;
  obj.params = new Object() as IUserProfile;
  obj.query = `INSERT INTO userProfiles(NAME, SURNAME, EMAIL, ID, PHOTO) 
                VALUES($NAME, $SURNAME, $EMAIL, $ID, $PHOTO)`;
  obj.params = JSON.parse(JSON.stringify(profile));

  return await runQuery(obj);
}
