export const createCollectionTable = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS collection_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      col_id INTEGER,
      col_visit_number INTEGER,
      col_present_count INTEGER,
      col_absent_count INTEGER,
      col_shifted_count INTEGER,
      col_deceased_count INTEGER,
      col_duplicate_count INTEGER,
      col_total_count INTEGER,
      col_part_no INTEGER,
      col_created_by INTEGER,
      col_ac_number INTEGER,
      user_id INTEGER
    );
  `;
  try {
    await db.executeSql(query);
    console.log('✅ Collections Details table created ');
  } catch (error) {
    console.log('❌ Error Collections Details table:', error);
  }
};

export const insertCollectionData = async (db, dataArray, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {

      tx.executeSql(
        `DELETE FROM collection_details WHERE user_id = ?`,
        [userId]
      );

      const insertQuery = `
        INSERT INTO collection_details
        (col_id, col_visit_number, col_present_count, col_absent_count,
         col_shifted_count, col_deceased_count, col_duplicate_count,
         col_total_count, col_part_no, col_created_by, col_ac_number, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      dataArray.forEach(item => {
        tx.executeSql(insertQuery, [
          item.col_id,
          item.col_visit_number,
          item.col_present_count,
          item.col_absent_count,
          item.col_shifted_count,
          item.col_deceased_count,
          item.col_duplicate_count,
          item.col_total_count,
          item.col_part_no,
          item.col_created_by,
          item.col_ac_number,
          userId
        ]);
      });
    },
    reject,
    resolve);
  });
};

export const getAllCollectionData = async (db, userId) => {
  const results = await db.executeSql(
    'SELECT * FROM collection_details WHERE user_id = ?',
    [userId]
  );
  let rows = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows?.length; i++) {
      rows.push(result.rows.item(i));
    }
  });
  return rows;
};

export const createSubmitCollectionsTable = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS submit_collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      payload TEXT NOT NULL
    );
  `;
  try {
    await db.executeSql(query);
    console.log('✅ Submitted Collections table created ');
  } catch (error) {
    console.log('❌ Error Submitted Collections table:', error);
  }
};

export const insertSubmittedCollections = async (db, payload) => {
  const userId = payload.user_id;

  const query = `
    INSERT INTO submit_collections (user_id, payload) VALUES (?, ?);
  `;
  await db.executeSql(query, [userId, JSON.stringify(payload)]);
  console.log('✅❌ Collection inserted offline for user:', userId);
};

export const getSubmittedCollections = async (db, userId) => {
  const results = await db.executeSql(`SELECT * FROM submit_collections WHERE user_id = ?`,
    [userId]
  );
  let collections = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows?.length; i++) {
      collections.push(result.rows.item(i));
    }
  });
  return collections;
};

export const getUnsyncedCollectionCount = async (db, userId) => {
  const results = await db.executeSql(`SELECT COUNT(*) as count FROM submit_collections WHERE user_id = ?`,
    [userId]
  );
  return results[0].rows.item(0).count;
};

export const deleteOfflineCollectionById = async (db, id, userId) => {
  await db.executeSql(`DELETE FROM submit_collections WHERE id = ? AND user_id = ?`, [id, userId]);
};
