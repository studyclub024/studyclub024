// Firestore Data Seeding Script
// Run this to populate your Firestore with initial course structure

import { db } from '../firebaseConfig';
import { Course, Chapter } from '../types/content.types';

export async function seedInitialData() {
  console.log('🌱 Starting to seed Firestore with initial data...');

  try {
    // ==================== SEED COURSES ====================
    
    const courses: Omit<Course, 'id'>[] = [
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chemistry Class 12',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 12,
        subject: 'Chemistry',
        description: 'Complete Chemistry course for Class 12 CBSE',
        metadata: {
          totalChapters: 16,
          totalTopics: 0,
          difficulty: 'Advanced',
          icon: 'Zap',
          color: '#ef4444',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mathematics Class 12',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 12,
        subject: 'Mathematics',
        description: 'Complete Mathematics course for Class 12 CBSE',
        metadata: {
          totalChapters: 13,
          totalTopics: 0,
          difficulty: 'Advanced',
          icon: 'Calculator',
          color: '#3b82f6',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Physics Class 10',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 10,
        subject: 'Physics',
        description: 'Complete Physics course for Class 10 CBSE',
        metadata: {
          totalChapters: 12,
          totalTopics: 0,
          difficulty: 'Intermediate',
          icon: 'Microscope',
          color: '#8b5cf6',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science Class 10',
        category: 'NCERT Solutions',
        board: 'CBSE',
        class: 10,
        subject: 'Science',
        description: 'Complete Science course for Class 10 CBSE',
        metadata: {
          totalChapters: 16,
          totalTopics: 0,
          difficulty: 'Intermediate',
          icon: 'Microscope',
          color: '#10b981',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📚 Creating courses...');
    const courseIds: Record<string, string> = {};

    for (const course of courses) {
      const docRef = await db.collection('courses').add(course);
      const courseKey = `${course.subject}-${course.class}`;
      courseIds[courseKey] = docRef.id;
      console.log(`✅ Created course: ${course.name} (${docRef.id})`);
    }

    // ==================== SEED CHAPTERS FOR PHYSICS CLASS 12 ====================

    const physicsChapters: Omit<Chapter, 'id'>[] = [
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Physics-12'],
        chapterNumber: 2,
        title: 'Electrostatic Potential and Capacitance',
        description: 'Electric potential, capacitors, dielectrics',
        order: 2,
        isPremium: false,
        estimatedHours: 7,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Physics-12'],
        chapterNumber: 3,
        title: 'Current Electricity',
        description: 'Electric current, Ohm\'s law, circuits, Kirchhoff\'s laws',
        order: 3,
        isPremium: true,
        estimatedHours: 9,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📖 Creating chapters for Physics Class 12...');

    for (const chapter of physicsChapters) {
      const docRef = await db.collection('chapters').add(chapter);
      console.log(`✅ Created chapter: ${chapter.title} (${docRef.id})`);
    }

    // ==================== SEED CHAPTERS FOR MATHEMATICS CLASS 10 ====================

    const mathChapters: Omit<Chapter, 'id'>[] = [
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Mathematics-10'],
        chapterNumber: 2,
        title: 'Polynomials',
        description: 'Zeros of polynomial, relationship between zeros and coefficients',
        order: 2,
        isPremium: false,
        estimatedHours: 7,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Mathematics-10'],
        chapterNumber: 3,
        title: 'Pair of Linear Equations in Two Variables',
        description: 'Algebraic and graphical solutions of linear equations',
        order: 3,
        isPremium: false,
        estimatedHours: 8,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Mathematics-10'],
        chapterNumber: 4,
        title: 'Quadratic Equations',
        description: 'Solutions of quadratic equations, nature of roots',
        order: 4,
        isPremium: false,
        estimatedHours: 7,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Mathematics-10'],
        chapterNumber: 5,
        title: 'Arithmetic Progressions',
        description: 'AP formulas, sum of n terms',
        order: 5,
        isPremium: false,
        estimatedHours: 6,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📖 Creating chapters for Mathematics Class 10...');

    for (const chapter of mathChapters) {
      const docRef = await db.collection('chapters').add(chapter);
      console.log(`✅ Created chapter: ${chapter.title} (${docRef.id})`);
    }

    // ==================== SEED CHAPTERS FOR SCIENCE CLASS 10 ====================

    const scienceChapters: Omit<Chapter, 'id'>[] = [
      {
        courseId: courseIds['Science-10'],
        chapterNumber: 1,
        title: 'Chemical Reactions and Equations',
        description: 'Types of chemical reactions, balancing equations, oxidation-reduction',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Science-10'],
        chapterNumber: 2,
        title: 'Acids, Bases and Salts',
        description: 'Properties of acids and bases, pH scale, importance of pH in daily life',
        order: 2,
        isPremium: false,
        estimatedHours: 7,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Science-10'],
        chapterNumber: 3,
        title: 'Metals and Non-metals',
        description: 'Physical and chemical properties, reactivity series, ionic compounds',
        order: 3,
        isPremium: false,
        estimatedHours: 8,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: courseIds['Science-10'],
        chapterNumber: 4,
        title: 'Life Processes',
        description: 'Nutrition, respiration, transportation, excretion in living organisms',
        order: 4,
        isPremium: false,
        estimatedHours: 9,
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📖 Creating chapters for Science Class 10...');

    for (const chapter of scienceChapters) {
      const docRef = await db.collection('chapters').add(chapter);
      console.log(`✅ Created chapter: ${chapter.title} (${docRef.id})`);
    }

    console.log('✨ Seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Created ${courses.length} courses`);
    console.log(`   - Created ${physicsChapters.length + mathChapters.length + scienceChapters.length} chapters`);
    console.log('\n💡 Next steps:');
    console.log('   1. Use the Admin Content Uploader to add topics');
    console.log('   2. Upload flashcards, summaries, and images');
    console.log('   3. Test the content in the Courses section');

    return { success: true, courseIds };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// ==================== HELPER: Clear all data (USE WITH CAUTION!) ====================

export async function clearAllData() {
  console.warn('⚠️  WARNING: This will delete ALL data from Firestore!');
  console.warn('⚠️  This action cannot be undone!');

  const collections = ['courses', 'chapters', 'topics', 'flashcards', 'content_summaries', 'user_progress'];

  for (const collectionName of collections) {
    console.log(`🗑️  Deleting ${collectionName}...`);
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`✅ Deleted ${snapshot.docs.length} documents from ${collectionName}`);
  }

  console.log('✅ All data cleared');
}

// ==================== USAGE ====================

// To run this script, add it to your App.tsx or create a separate admin page
// Example:
//
// import { seedInitialData } from './scripts/seedData';
//
// function AdminPage() {
//   const handleSeed = async () => {
//     await seedInitialData();
//   };
//
//   return <button onClick={handleSeed}>Seed Data</button>;
// }
