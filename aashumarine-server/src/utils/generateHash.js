import bcrypt from 'bcryptjs';

/**
 * Utility script to generate bcrypt hash for passwords
 * Usage: node src/utils/generateHash.js <password>
 */

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\n🔐 Password Hash Generated:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('─────────────────────────────────────────────────────────────');
  console.log('\nCopy this hash to your seed file (001_users.sql)\n');
  
  process.exit(0);
});
