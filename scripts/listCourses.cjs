const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listCourses() {
  console.log('\n📚 AVAILABLE COURSES AND CHAPTERS:\n');
  console.log('='.repeat(60));
  
  const coursesSnapshot = await db.collection('courses').orderBy('name').get();
  
  for (const doc of coursesSnapshot.docs) {
    const course = doc.data();
    console.log(`\n📘 Course ID: ${doc.id}`);
    console.log(`   Name: ${course.name}`);
    console.log(`   Subject: ${course.subject} | Class: ${course.class}`);
    
    // Get chapters for this course
    const chaptersSnapshot = await db.collection('chapters')
      .where('courseId', '==', doc.id)
      .orderBy('order')
      .get();
    
    console.log(`\n   📖 Chapters (${chaptersSnapshot.size}):`);
    chaptersSnapshot.forEach(chapterDoc => {
      const chapter = chapterDoc.data();
      console.log(`      ${chapterDoc.id}`);
      console.log(`      └─ ${chapter.title} (Order: ${chapter.order})`);
    });
    console.log('\n' + '-'.repeat(60));
  }
  
  console.log('\n✅ To upload content:');
  console.log('   1. Copy a Course ID from above');
  console.log('   2. Copy a Chapter ID for that course');
  console.log('   3. Paste them in the upload form\n');
}

listCourses()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
