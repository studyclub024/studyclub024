import React, { useState } from 'react';
// Updated to compat API to resolve named export errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth, db, googleProvider } from '../../firebaseConfig';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Info,
  LogIn,
  ChevronLeft
} from 'lucide-react';
import { FootballIcon } from '../../App';

export const PREBUILT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Boots",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Loki",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Snickers",
];

const AuthScreen: React.FC<{ onClose?: () => void; isModal?: boolean }> = ({ onClose, isModal = false }) => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PREBUILT_AVATARS[0]);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncUserToFirestore = async (user: any, name?: string, photo?: string) => {
    try {
      // Updated Firestore query to compat style
      const userDocRef = db.collection('users').doc(user.uid);
      const userSnapshot = await userDocRef.get();
      
      if (!userSnapshot.exists) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        
        await userDocRef.set({
          userId: user.uid,
          displayName: name || user.displayName || 'Learner',
          email: user.email,
          photoURL: photo || user.photoURL || PREBUILT_AVATARS[0],
          planExpiry: expiryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
          preferences: {
            flashcardTheme: 'classic',
            nativeLanguage: 'Hindi',
            studyDifficulty: 'intermediate',
          },
          stats: {
            totalGenerations: 0,
            streakDays: 1,
            masteredConcepts: 0,
            lastActiveDate: Date.now(),
          }
        });
      }
    } catch (err: any) {
      console.error("Sync User Firestore Error:", err);
      if (err.code === 'permission-denied') {
        throw new Error("FIRESTORE_PERMISSION_DENIED");
      }
      throw err;
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Replaced modular sendPasswordResetEmail with compat instance method
      await auth.sendPasswordResetEmail(email);
      setResetSent(true);
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError("Could not send reset email. Please ensure the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setError(null);
    setGoogleLoading(true);
    try {
      // Replaced modular signInWithPopup with compat instance method
      const result = await auth.signInWithPopup(googleProvider);
      await syncUserToFirestore(result.user);
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.message === 'FIRESTORE_PERMISSION_DENIED') {
        setError("Database Access Error: Your account was created, but your profile couldn't be synced due to Firestore Security Rules.");
      } else if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        const settingsUrl = `https://console.firebase.google.com/project/my-website-map-470209/authentication/settings`;
        setError(
          <div className="flex flex-col gap-5 p-2 animate-fade-in text-left">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-50 p-3 rounded-2xl shadow-sm"><ShieldAlert size={28} /></div>
              <div>
                <span className="font-black uppercase tracking-tight text-xs block">Connection Blocked</span>
                <span className="text-[10px] font-bold text-red-500/70">Firebase Domain Authorization Required</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
               <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
               <p className="text-[11px] leading-relaxed text-amber-900 font-medium">Google requires whitelisting this preview URL.</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="bg-white border-2 border-indigo-50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                  <code className="text-[11px] font-mono text-indigo-600 truncate font-bold">{currentDomain}</code>
                  <button onClick={() => copyDomain(currentDomain)} className="p-2.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-indigo-600">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <a href={settingsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Go to Firebase Console <ExternalLink size={14} />
              </a>
            </div>
          </div>
        );
      } else {
        setError("Google authentication failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!isLogin && (!firstName.trim() || !lastName.trim())) { setError("Please provide both First and Last name."); return; }

    setLoading(true);
    try {
      if (isLogin) {
        // Replaced modular signInWithEmailAndPassword with compat instance method
        const result = await auth.signInWithEmailAndPassword(email.trim(), password);
        await syncUserToFirestore(result.user);
        if (onClose) onClose();
      } else {
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        // Replaced modular createUserWithEmailAndPassword with compat instance method
        const userCredential = await auth.createUserWithEmailAndPassword(email.trim(), password);
        // Replaced modular updateProfile with compat instance method
        if (userCredential.user) {
            await userCredential.user.updateProfile({
                displayName: fullName,
                photoURL: selectedAvatar
            });
            await syncUserToFirestore(userCredential.user, fullName, selectedAvatar);
            if (onClose) onClose();
        }
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      
      // Friendly message mapping
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Login Failed: Incorrect email or password. Please verify your credentials.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email Occupied: This email is already associated with an account. Try signing in.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Format Error: The email address provided is not valid.");
      } else if (err.code === 'auth/weak-password') {
        setError("Security Notice: Use at least 6 characters for your password.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Security Block: Too many failed attempts. Please try again later.");
      } else if (err.message === 'FIRESTORE_PERMISSION_DENIED') {
        setError(
          <div className="flex flex-col gap-3">
            <span className="font-bold">Sync Error (Permission Denied)</span>
            <p className="text-xs opacity-80">Authentication succeeded, but we couldn't sync your profile. Check your Firestore Security Rules.</p>
          </div>
        );
      } else {
        setError(err.message || "An unexpected error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isJsxError = React.isValidElement(error);

  if (isResetMode && !isModal) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] animate-fade-in-up">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
              <GraduationCap size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">StudyClub24</h1>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-indigo-100/50 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="relative z-10">
              {resetSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                    <Check size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Sent</h2>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    We sent you a password change link to <br/><span className="font-bold text-indigo-600">{email}</span>. Please check your inbox and spam folder.
                  </p>
                  <button 
                    onClick={() => { setIsResetMode(false); setResetSent(false); setIsLogin(true); }}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} /> Sign In
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsResetMode(false)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-bold group"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-500 text-sm mb-8 font-medium">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {error && (
                    <div className="mb-6 p-4 rounded-[1.5rem] bg-red-50 border border-red-100 text-red-600 flex items-start gap-3 animate-fade-in">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div className="text-sm font-bold flex-1">{error}</div>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        required 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? <FootballIcon size={18} className="text-white" /> : "Get Reset Link"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} />
        <div className="relative w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 relative overflow-hidden">
            <button onClick={() => onClose && onClose()} className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:text-gray-800 bg-white shadow" aria-label="Close"><X /></button>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-md mb-3">
                <GraduationCap size={32} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">StudyClub24</h1>
              <p className="text-sm text-gray-500 mt-1">{isLogin ? "Enter your credentials to access your workspace." : "Choose an identity and start your journey."}</p>
            </div>

            <div className="relative z-10">
              {error && (
                <div className={`mb-6 p-4 rounded-[1.5rem] border flex items-start gap-3 animate-fade-in ${isJsxError ? 'bg-white border-gray-100 shadow-xl ring-4 ring-indigo-50/5' : 'bg-red-50 border-red-100 text-red-600'}`}>
                  {!isJsxError && <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}
                  <div className={`text-sm font-bold flex-1 ${!isJsxError ? 'text-red-600' : ''}`}>{error}</div>
                  {!isJsxError && (
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors"><X size={16} /></button>
                  )}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="mb-6">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-4 text-center">Select Your Avatar</label>
                      <div className="grid grid-cols-4 gap-3">
                        {PREBUILT_AVATARS.map((avatar, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedAvatar === avatar ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-105' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-indigo-200'}`}
                            aria-label={`Select avatar option ${idx + 1}`}
                          >
                            <img src={avatar} alt={`Avatar character option ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" required placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                      <input type="text" required placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button 
                      type="button"
                      onClick={() => { setIsResetMode(true); setError(null); }}
                      className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" disabled={loading || googleLoading} className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <FootballIcon size={16} className="text-white" /> : isLogin ? "Sign In" : "Register Now"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm"
              >
                {googleLoading ? (
                  <FootballIcon size={16} className="text-gray-700" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                      <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                    </svg>
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-gray-500 text-sm font-bold hover:text-indigo-600 transition-colors inline-flex items-center gap-2 group">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                    {isLogin ? "Join Now" : "Sign In"} <ArrowRight size={14} className="inline ml-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">StudyClub24</h1>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-2">Personal Academic Gateway</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-indigo-100/50 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              {isLogin ? "Enter your credentials to access your workspace." : "Choose an identity and start your journey."}
            </p>

            {error && (
              <div className={`mb-6 p-4 rounded-[1.5rem] border flex items-start gap-3 animate-fade-in ${isJsxError ? 'bg-white border-gray-100 shadow-xl ring-4 ring-indigo-50/5' : 'bg-red-50 border-red-100 text-red-600'}`}>
                {!isJsxError && <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}
                <div className={`text-sm font-bold flex-1 ${!isJsxError ? 'text-red-600' : ''}`}>{error}</div>
                {!isJsxError && (
                  <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors"><X size={16} /></button>
                )}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="mb-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-4 text-center">Select Your Avatar</label>
                    <div className="grid grid-cols-4 gap-3">
                      {PREBUILT_AVATARS.map((avatar, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedAvatar === avatar ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-105' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-indigo-200'}`}
                          aria-label={`Select avatar option ${idx + 1}`}
                        >
                          <img src={avatar} alt={`Avatar character option ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                    <input type="text" required placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-gray-800 text-sm" />
              </div>

              {isLogin && (
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => { setIsResetMode(true); setError(null); }}
                    className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading || googleLoading} className="w-full py-4 mt-2 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <FootballIcon size={18} className="text-white" /> : isLogin ? "Sign In" : "Register Now"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-md"
            >
              {googleLoading ? (
                <FootballIcon size={18} className="text-gray-700" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                  </svg>
                  {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </>
              )}
            </button>

            <div className="mt-8 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-gray-500 text-sm font-bold hover:text-indigo-600 transition-colors inline-flex items-center gap-2 group">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                  {isLogin ? "Join Now" : "Sign In"} <ArrowRight size={14} className="inline ml-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;