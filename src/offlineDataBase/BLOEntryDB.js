export const createBLODetailsTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS blo_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    el_id INTEGER,
    el_part_no INTEGER,
    el_ac_number INTEGER,
    el_2025_male INTEGER,
    el_2025_female INTEGER,
    el_2025_tg INTEGER,
    el_2025_total INTEGER,
    el_form6_app INTEGER,
    el_form8_app INTEGER,
    el_migration INTEGER,
    el_total_app INTEGER,
    el_created_on TEXT,
    user_id INTEGER NOT NULL
  );`;
  await db.executeSql(query);
};

export const saveBLODetails = async (db, details, userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {

      // Delete existing record for the user
      tx.executeSql(
        `DELETE FROM blo_details WHERE user_id = ?`,
        [userId]
      );

      const insertQuery = `
        INSERT OR REPLACE INTO blo_details 
        (el_id, el_part_no, el_ac_number, el_2025_male, el_2025_female, el_2025_tg, el_2025_total, el_form6_app, el_form8_app, el_migration, el_total_app, el_created_on, user_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      tx.executeSql(insertQuery, [
        details.el_id || 0,
        details.el_part_no || 0,
        details.el_ac_number || 0,
        details.el_2025_male || 0,
        details.el_2025_female || 0,
        details.el_2025_tg || 0,
        details.el_2025_total || 0,
        details.el_form6_app || 0,
        details.el_form8_app || 0,
        details.el_migration || 0,
        details.el_total_app || 0,
        details.el_created_on || '',
        userId
      ]);
    },
    reject,
    resolve);
  });
};

export const getOfflineBLODetails = async (db, el_part_no, el_ac_number, userId) => {
  const results = await db.executeSql(
    `SELECT * FROM blo_details WHERE el_part_no = ? AND el_ac_number = ? AND user_id = ?`,
    [el_part_no, el_ac_number, userId]
  );
  return results[0].rows.raw();
};
