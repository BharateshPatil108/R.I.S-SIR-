export const createDistributionTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS distribution (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dtb_id INTEGER,
    dtb_day_count INTEGER,
    dtb_direct_count INTEGER,
    dtb_dropped_count INTEGER,
    dtb_total_count INTEGER,
    dtb_part_no INTEGER,
    dtb_ac_number INTEGER,
    dtb_created_on TEXT,
    user_id INTEGER
  );`;
  
  try {
    await db.executeSql(query);
    console.log('✅ Distribution details table created ');
  } catch (error) {
    console.log('❌ Error Distribution details table:', error);
  }
};

export const insertDistributionData = async (db, data, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Delete old data for this user
      tx.executeSql(
        `DELETE FROM distribution WHERE user_id = ?`,
        [userId]
      );

      // Insert new records
      const insertQuery = `
        INSERT INTO distribution
        (dtb_id, dtb_day_count, dtb_direct_count, dtb_dropped_count, dtb_total_count,
         dtb_part_no, dtb_ac_number, dtb_created_on, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      data.forEach(item => {
        tx.executeSql(insertQuery, [
          item.dtb_id,
          item.dtb_day_count,
          item.dtb_direct_count,
          item.dtb_dropped_count,
          item.dtb_total_count,
          item.dtb_part_no,
          item.dtb_ac_number,
          item.dtb_created_on,
          userId
        ]);
      });
    },
    reject,
    resolve);
  });
};

export const getOfflineDistributionData = async (db, userId) => {
  const results = await db.executeSql(`SELECT * FROM distribution WHERE user_id = ?`,
    [userId]
  );
  let data = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows?.length; i++) {
      data.push(result.rows.item(i));
    }
  });
  return data;
};

export const createSubmitDistributionTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS submit_distribution (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dtb_day_count INTEGER,
    dtb_direct_count INTEGER,
    dtb_dropped_count INTEGER,
    dtb_total_count INTEGER,
    dtb_part_no INTEGER,
    dtb_created_by INTEGER,
    dtb_ac_number INTEGER,
    user_id INTEGER NOT NULL,
    submitted INTEGER DEFAULT 0
  );`;
  
  try {
    await db.executeSql(query);
    console.log('✅ Submitted Distribution table created ');
  } catch (error) {
    console.log('❌ Error Submitted Distribution table:', error);
  }
};

export const saveSubmittedDistributionOffline = async (db, distribution) => {
  try {
    const query = `INSERT INTO submit_distribution 
      (dtb_day_count, dtb_direct_count, dtb_dropped_count, dtb_total_count, dtb_part_no, dtb_created_by, dtb_ac_number, user_id, submitted) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;
    
    await db.executeSql(query, [
      distribution.dtb_day_count,
      distribution.dtb_direct_count,
      distribution.dtb_dropped_count,
      distribution.dtb_total_count,
      distribution.dtb_part_no,
      distribution.dtb_created_by,
      distribution.dtb_ac_number,
      distribution.user_id,
    ]);

    console.log('✅ Distribution saved offline');
  } catch (error) {
    console.log('❌ Error saving distribution offline:', error);
  }
};

export const getUnsyncedDistributions = async (db, userId) => {
  try {
    const results = await db.executeSql('SELECT * FROM submit_distribution WHERE submitted = 0 AND user_id = ?',
      [userId]);
    let items = [];
    results.forEach(result => {
      for (let i = 0; i < result.rows?.length; i++) {
        items.push(result.rows.item(i));
      }
    });
    return items;
  } catch (error) {
    console.log('❌ Error fetching offline distributions:', error);
    return [];
  }
};

export const fetchUnsyncedDistributions = async (db, userId) => {
  try {
    const results = await db.executeSql(
      'SELECT COUNT(*) as count FROM submit_distribution WHERE submitted = 0 AND user_id = ?',
      [userId]
    );
    const count = results[0].rows.item(0).count;
    return count;
  } catch (error) {
    console.log("Error fetching unsynced distributions:", error);
    return 0;
  }
};

export const deleteOfflineDistributionById = async (db, id, userId) => {
  await db.executeSql('DELETE FROM submit_distribution WHERE id = ? AND user_id = ?',[id, userId]);
};
