import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'app.db', location: 'default'});
};

export const deleteDatabase = async () => {
  try {
    await SQLite.deleteDatabase({ name: 'app.db', location: 'default' });
    console.log('✅ Database deleted successfully');
  } catch (error) {
    console.log('❌ Error deleting database:', error);
  }
};