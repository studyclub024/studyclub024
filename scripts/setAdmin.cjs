const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function setAdminRole() {
  try {
    console.log('\n🔐 Setting Admin Role\n');
    console.log('='.repeat(60));

    // List all users
    const listUsersResult = await auth.listUsers();
    
    if (listUsersResult.users.length === 0) {
      console.log('❌ No users found. Please sign up first.');
      process.exit(1);
    }

    console.log(`\n📋 Found ${listUsersResult.users.length} user(s):\n`);
    
    listUsersResult.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Display Name: ${user.displayName || 'Not set'}`);
      console.log('');
    });

    // Set the first user as admin
    const firstUser = listUsersResult.users[0];
    console.log(`\n⚡ Setting ${firstUser.email} as ADMIN...\n`);

    await db.collection('users').doc(firstUser.uid).set({
      email: firstUser.email,
      displayName: firstUser.displayName || 'Admin User',
      role: 'admin',
      subscription: 'premium',
      stats: {
        dailyGenerations: 0,
        weeklyGenerations: 0,
        monthlyGenerations: 0,
        lastActiveDate: Date.now(),
      },
      achievements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    console.log('✅ Successfully set admin role!');
    console.log('\n📝 User document updated:');
    console.log(`   Email: ${firstUser.email}`);
    console.log(`   Role: admin`);
    console.log(`   Subscription: premium`);
    console.log('\n🎉 You can now upload content to Firebase Storage!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setAdminRole()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
