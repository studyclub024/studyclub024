// Admin Dashboard Component - Quick access to seed data and upload content
import React, { useState } from 'react';
import { Database, Upload, BookOpen, FileText, Settings, CheckCircle, AlertCircle, Loader2, Layers } from 'lucide-react';
import { seedInitialData, clearAllData } from '../../scripts/seedData';
import ContentUploader from './ContentUploader';
import CourseManagerModal from './CourseManagerModal';

const AdminDashboard: React.FC = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [showCourseManager, setShowCourseManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSeedData = async () => {
    if (!confirm('This will create initial courses and chapters. Continue?')) return;

    setLoading(true);
    setMessage(null);

    try {
      await seedInitialData();
      setMessage({
        type: 'success',
        text: 'Successfully seeded database with 5 courses and sample chapters!',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Failed to seed data: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL DATA from Firestore! This cannot be undone. Continue?')) {
      return;
    }

    if (!confirm('Are you ABSOLUTELY SURE? This will delete all courses, chapters, topics, flashcards, and summaries!')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await clearAllData();
      setMessage({
        type: 'success',
        text: 'All data cleared successfully',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Failed to clear data: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Settings size={32} className="text-indigo-600" />
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage courses, chapters, and content
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              )}
              <p
                className={`text-sm ${
                  message.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seed Database */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Database size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Seed Database
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create initial structure
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will create:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6">
              <li>• Physics Class 12 (3 chapters)</li>
              <li>• Chemistry Class 12</li>
              <li>• Mathematics Class 12</li>
              <li>• Physics Class 10</li>
              <li>• Mathematics Class 10 (2 chapters)</li>
            </ul>

            <button
              onClick={handleSeedData}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Database size={20} />
                  Seed Database
                </>
              )}
            </button>
          </div>

          {/* Manage Courses/Chapters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <Layers size={24} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Courses & Chapters
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add course structure from UI
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Create a new course (subject/class/board) and add chapters without running scripts.
            </p>

            <button
              onClick={() => setShowCourseManager(true)}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              <Layers size={20} />
              Manage Courses
            </button>
          </div>

          {/* Upload Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Upload size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Upload Content
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add topics to courses
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload flashcards, summaries, and images for any course chapter.
            </p>

            <div className="space-y-2 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <FileText size={16} className="inline mr-2" />
                Flashcards: CSV format
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <FileText size={16} className="inline mr-2" />
                Summary: .txt, .md, .docx
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <BookOpen size={16} className="inline mr-2" />
                Images: .jpg, .png, .svg
              </div>
            </div>

            <button
              onClick={() => setShowUploader(true)}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Open Uploader
            </button>
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 md:col-span-2">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              Quick Start Guide
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Seed Database
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click "Seed Database" to create initial courses and chapters structure
                </p>
              </div>

              <div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Prepare Files
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create CSV for flashcards, write summaries, collect diagrams and images
                </p>
              </div>

              <div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Upload Content
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use the uploader to add topics with flashcards, summaries, and images
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 md:col-span-2">
            <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-4">
              ⚠️ Danger Zone
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The following action will permanently delete ALL data from Firestore. This cannot be undone!
            </p>
            <button
              onClick={handleClearData}
              disabled={loading}
              className="py-3 px-6 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Course/Chapter Manager Modal */}
      {showCourseManager && (
        <CourseManagerModal
          onClose={() => setShowCourseManager(false)}
        />
      )}

      {/* Content Uploader Modal */}
      {showUploader && (
        <ContentUploader
          onClose={() => setShowUploader(false)}
          onSuccess={() => {
            setMessage({
              type: 'success',
              text: 'Content uploaded successfully!',
            });
            setShowUploader(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
