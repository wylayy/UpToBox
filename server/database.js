const path = require('path');
const fs = require('fs');

// Database path
const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory database
let database = {
  files: {},
  analytics: []
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(data);
      // Ensure database has proper structure
      database = {
        files: parsed.files || {}
      };
      console.log(`✅ Database loaded: ${Object.keys(database.files).length} files`);
    } else {
      database = { files: {} };
      saveDatabase();
      console.log('✅ New database created');
    }
  } catch (error) {
    console.error('❌ Error loading database:', error);
    database = { files: {} };
    saveDatabase();
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
}

// Initialize database
loadDatabase();

// Database operations
const dbOps = {
  // Add new file
  addFile(fileData) {
    try {
      database.files[fileData.id] = {
        id: fileData.id,
        original_name: fileData.originalName,
        filename: fileData.filename,
        mimetype: fileData.mimetype,
        size: fileData.size,
        upload_date: fileData.uploadDate,
        expiry_date: fileData.expiryDate || null,
        password_hash: fileData.password_hash || null,
        password_salt: fileData.password_salt || null,
        downloads: 0,
        created_at: new Date().toISOString()
      };
      saveDatabase();
      return true;
    } catch (error) {
      console.error('Database error adding file:', error);
      return false;
    }
  },

  // Get file by ID
  getFile(fileId) {
    try {
      return database.files[fileId] || null;
    } catch (error) {
      console.error('Database error getting file:', error);
      return null;
    }
  },

  // Increment download count
  incrementDownloads(fileId) {
    try {
      if (database.files[fileId]) {
        database.files[fileId].downloads++;
        saveDatabase();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Database error updating downloads:', error);
      return false;
    }
  },

  // Delete file
  deleteFile(fileId) {
    try {
      if (database.files[fileId]) {
        delete database.files[fileId];
        saveDatabase();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Database error deleting file:', error);
      return false;
    }
  },

  // Get all expired files
  getExpiredFiles() {
    try {
      const now = new Date();
      return Object.values(database.files).filter(file => {
        if (!file.expiry_date) return false;
        return new Date(file.expiry_date) <= now;
      });
    } catch (error) {
      console.error('Database error getting expired files:', error);
      return [];
    }
  },

  // Get all files
  getAllFiles() {
    try {
      return Object.values(database.files).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    } catch (error) {
      console.error('Database error getting all files:', error);
      return [];
    }
  },

  // Get statistics
  getStats() {
    try {
      const files = Object.values(database.files);
      return {
        total_files: files.length,
        total_size: files.reduce((sum, file) => sum + file.size, 0),
        total_downloads: files.reduce((sum, file) => sum + file.downloads, 0)
      };
    } catch (error) {
      console.error('Database error getting stats:', error);
      return { total_files: 0, total_size: 0, total_downloads: 0 };
    }
  },

  // Add analytics entry
  addAnalytics(analyticsData) {
    try {
      if (!database.analytics) {
        database.analytics = [];
      }
      database.analytics.push(analyticsData);
      
      // Keep only last 10000 entries to prevent file size growth
      if (database.analytics.length > 10000) {
        database.analytics = database.analytics.slice(-10000);
      }
      
      saveDatabase();
      return true;
    } catch (error) {
      console.error('Database error adding analytics:', error);
      return false;
    }
  },

  // Get analytics for a file
  getFileAnalytics(fileId) {
    try {
      if (!database.analytics) return [];
      return database.analytics.filter(entry => entry.fileId === fileId);
    } catch (error) {
      console.error('Database error getting file analytics:', error);
      return [];
    }
  },

  // Get all analytics
  getAllAnalytics() {
    try {
      return database.analytics || [];
    } catch (error) {
      console.error('Database error getting all analytics:', error);
      return [];
    }
  }
};

// Graceful shutdown - save database
process.on('exit', () => saveDatabase());
process.on('SIGHUP', () => { saveDatabase(); process.exit(128 + 1); });
process.on('SIGINT', () => { saveDatabase(); process.exit(128 + 2); });
process.on('SIGTERM', () => { saveDatabase(); process.exit(128 + 15); });

module.exports = dbOps;
