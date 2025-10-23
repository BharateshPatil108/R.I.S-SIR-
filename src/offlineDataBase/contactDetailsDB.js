// contact details
export const createContactTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS contact_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      role TEXT,
      mobileNumber TEXT,
      dist_number TEXT,
      ac_number TEXT,
      part_number TEXT,
      dist_name TEXT,
      ac_name TEXT,
      unique_key TEXT UNIQUE
    );`;
    
  try {
    await db.executeSql(query);
  } catch (error) {
    console.log('❌ Error creating Contact table:', error);
  }
};

export const saveContacts = async (db, contacts) => {
  await db.executeSql("DELETE FROM contact_details");
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const insertQuery = `INSERT OR REPLACE INTO contact_details 
        (name, role, mobileNumber, dist_number, ac_number, part_number, dist_name, ac_name, unique_key) 
          VALUES (?,?,?,?,?,?,?,?,?)`;

      contacts.forEach(c => {
        tx.executeSql(insertQuery, [
          c.name || '',
          c.role || '',
          c.mobileNumber || '',
          c.dist_number || '',
          c.ac_number || '',
          c.part_number || '',
          c.dist_name || '',
          c.ac_name || '',
          c.h_id ? c.h_id.toString() : c.mobileNumber
        ]);
      });
    },
    reject,
    resolve);
  });
};

export const getOfflineContacts = async (db) => {
  const results = await db.executeSql("SELECT * FROM contact_details");
  return results[0].rows.raw();
};

// Roles Details
export const createRoleTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    name TEXT
  );`;
  await db.executeSql(query);
};

export const saveRoles = async (db, roles) => {
  await db.executeSql('DELETE FROM roles;'); // clear old data
  const insertQuery = `INSERT INTO roles (role_id, name) VALUES (?, ?)`;
  for (const role of roles) {
    await db.executeSql(insertQuery, [role.role_id, role.name]);
  }
};

export const getOfflineRoles = async (db) => {
  try {
    const results = await db.executeSql('SELECT * FROM roles');
    let items = [];
    results.forEach(result => {
      for (let i = 0; i < result?.rows?.length; i++) {
        items.push(result.rows.item(i));
      }
    });
    return items;
  } catch (error) {
    console.log("Error fetching offline roles", error);
    return [];
  }
};


// district details
export const createDistrictTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dist_number INTEGER,
    name TEXT
  );`;
  await db.executeSql(query);
};

export const saveDistricts = async (db, districts) => {
  await db.executeSql('DELETE FROM districts;'); // clear old data
  const insertQuery = `INSERT INTO districts (dist_number, name) VALUES (?, ?)`;
  for (const dist of districts) {
    await db.executeSql(insertQuery, [dist.dist_number, dist.name]);
  }
};

export const getOfflineDistricts = async (db) => {
  try {
    const results = await db.executeSql('SELECT * FROM districts');
    let items = [];
    results.forEach(result => {
      for (let i = 0; i < result?.rows?.length; i++) {
        items.push(result.rows.item(i));
      }
    });
    return items;
  } catch (error) {
    console.log("Error fetching offline districts", error);
    return [];
  }
};


// Assembly details
export const createAssemblyTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS assemblys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ac_number INTEGER,
    name TEXT,
    ac_dist_number INTEGER
  );`;
  await db.executeSql(query);
};

export const saveAssemblys = async (db, assemblys) => {
  await db.executeSql('DELETE FROM assemblys;'); // clear old data
  const insertQuery = `INSERT INTO assemblys (ac_number, name, ac_dist_number) VALUES (?, ?, ?)`;
  for (const assembly of assemblys) {
    await db.executeSql(insertQuery, [assembly.ac_number, assembly.name, assembly.ac_dist_number]);
  }
};

export const getOfflineAssemblys = async (db) => {
  try {
    const results = await db.executeSql('SELECT * FROM assemblys');
    let items = [];
    results.forEach(result => {
      for (let i = 0; i < result?.rows?.length; i++) {
        items.push(result.rows.item(i));
      }
    });
    return items;
  } catch (error) {
    console.log("Error fetching offline assemblys", error);
    return [];
  }
};


// Parts details
export const createPartTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT,
    name TEXT,
    h_ac_number INTEGER
  );`;
  
  try {
    await db.executeSql(query);
    console.log('✅ Parts table created (if not exists)');
  } catch (error) {
    console.log('❌ Error creating parts table:', error);
  }
};

// export const saveParts = async (db, parts) => {
//   await db.executeSql('DELETE FROM parts;'); // clear old data
//   const insertQuery = `INSERT INTO parts (number, name, h_ac_number) VALUES (?, ?, ?)`;
//   for (const part of parts) {
//     await db.executeSql(insertQuery, [part.number, part.name, part.h_ac_number]);
//   }
// };

export const saveParts = async (db, parts = []) => {
  try {
    await db.transaction(async (tx) => {
      await tx.executeSql('DELETE FROM parts;');

      if (!parts || parts?.length === 0) {
        console.log('⚠️ No parts to save.');
        return;
      }

      const insertQuery = `INSERT INTO parts (number, name, h_ac_number) VALUES (?, ?, ?)`;

      parts.forEach(part => {
        // handle nullables safely
        const number = part?.number ?? '0';
        const name = part?.name ?? '';
        const acNum = part?.h_ac_number ?? 0;

        tx.executeSql(insertQuery, [number, name, acNum]);
      });

      console.log(`✅ Inserted ${parts?.length} records into parts table`);
    });
  } catch (error) {
    console.log('❌ Error saving parts:', error);
  }
};

export const appendParts = async (db, parts = []) => {
  try {
    if (!parts || parts.length === 0) {
      console.log('⚠️ No parts to append.');
      return;
    }

    await db.transaction(async (tx) => {
      const insertQuery = `INSERT INTO parts (number, name, h_ac_number) VALUES (?, ?, ?)`;

      parts.forEach(part => {
        const number = part?.number ?? '0';
        const name = part?.name ?? '';
        const acNum = part?.h_ac_number ?? 0;

        tx.executeSql(insertQuery, [number, name, acNum]);
      });

      console.log(`✅ Appended ${parts?.length} records into parts table`);
    });
  } catch (error) {
    console.log('❌ Error appending parts:', error);
  }
};


export const getOfflineParts = async (db) => {
  try {
    const results = await db.executeSql('SELECT * FROM parts');
    let items = [];
    results.forEach(result => {
      for (let i = 0; i < result?.rows?.length; i++) {
        items.push(result.rows.item(i));
      }
    });
    return items;
  } catch (error) {
    console.log("Error fetching offline parts", error);
    return [];
  }
};




