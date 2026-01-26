// Simple Node.js seed script that can run with temporary open rules
const admin = require('firebase-admin');

// Initialize Firebase Admin (without service account for local testing)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'my-website-map-470209',
  });
}

const db = admin.firestore();

async function seedData() {
  console.log('🌱 Starting to seed Firestore with initial data...');

  try {
    const courses = [
      {
        name: 'Physics Class 12',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 12,
        subject: 'Physics',
        description: 'Complete Physics course for Class 12 CBSE',
        metadata: {
          totalChapters: 15,
          totalTopics: 0,
          difficulty: 'Advanced',
          icon: 'Microscope',
          color: '#8b5cf6',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Mathematics Class 10',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 10,
        subject: 'Mathematics',
        description: 'Complete Mathematics course for Class 10 CBSE',
        metadata: {
          totalChapters: 15,
          totalTopics: 0,
          difficulty: 'Intermediate',
          icon: 'Calculator',
          color: '#3b82f6',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    console.log('📚 Creating courses...');
    const courseIds = {};

    for (const course of courses) {
      const docRef = await db.collection('courses').add(course);
      const courseKey = `${course.subject}-${course.class}`;
      courseIds[courseKey] = docRef.id;
      console.log(`✅ Created course: ${course.name} (${docRef.id})`);
    }

    const chapters = [
      {
        courseId: courseIds['Physics-12'],
        chapterNumber: 1,
        title: 'Electric Charges and Fields',
        description: 'Introduction to electrostatics, Coulomb\'s law, electric field',
        order: 1,
        isPremium: false,
        estimatedHours: 8,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        courseId: courseIds['Mathematics-10'],
        chapterNumber: 1,
        title: 'Real Numbers',
        description: 'Euclid\'s division lemma, fundamental theorem of arithmetic',
        order: 1,
        isPremium: false,
        estimatedHours: 6,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    console.log('📖 Creating chapters...');
    for (const chapter of chapters) {
      const docRef = await db.collection('chapters').add(chapter);
      console.log(`✅ Created chapter: ${chapter.title} (${docRef.id})`);
    }

    console.log('✨ Seeding completed successfully!');
    console.log('📊 Created 2 courses and 2 chapters');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
