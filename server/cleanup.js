const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const db = require('./database');

// Cleanup expired files every hour
function startCleanupCron(uploadDir) {
  cron.schedule('0 * * * *', () => {
    console.log('🧹 Running expired files cleanup...');
    
    try {
      const expiredFiles = db.getExpiredFiles();
      
      if (expiredFiles.length === 0) {
        console.log('✅ No expired files to clean');
        return;
      }

      let deletedCount = 0;
      let errorCount = 0;

      expiredFiles.forEach(file => {
        try {
          // Delete physical file
          const filePath = path.join(uploadDir, file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          // Delete from database
          db.deleteFile(file.id);
          deletedCount++;
          console.log(`🗑️  Deleted expired file: ${file.original_name} (ID: ${file.id})`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Error deleting file ${file.id}:`, error.message);
        }
      });

      console.log(`✅ Cleanup complete: ${deletedCount} files deleted, ${errorCount} errors`);
    } catch (error) {
      console.error('❌ Cleanup cron error:', error);
    }
  });

  console.log('⏰ Cleanup cron job started (runs every hour)');
}

module.exports = { startCleanupCron };
