
export const createOtpTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS otp_session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT UNIQUE,
      otp TEXT,
      token TEXT,
      expiryDate TEXT
    );`;
  await db.executeSql(query);
};

export const saveOtpSession = async (db, mobileNumber, otp, token, expiryDate) => {
  // First clear any existing session for this mobile number
  await clearOtpSession(db, mobileNumber);
  
  const insertQuery = `INSERT INTO otp_session (mobile, otp, token, expiryDate) VALUES (?, ?, ?, ?);`;
  await db.executeSql(insertQuery, [mobileNumber, otp, token, expiryDate]);
};

export const getOtpSession = async (db, mobile) => {
  try {
    const results = await db.executeSql(
      `SELECT * FROM otp_session WHERE mobile=? ORDER BY id DESC LIMIT 1;`,
      [mobile]
    );
    if (results[0].rows?.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.log('Error getting OTP session:', error);
    return null;
  }
};

export const clearOtpSession = async (db, mobile) => {
  await db.executeSql(`DELETE FROM otp_session WHERE mobile=?;`, [mobile]);
};