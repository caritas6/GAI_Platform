'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/* ── 역할 타입 ── */
export type UserRole = 'student' | 'professor' | 'industry' | 'researcher';

export interface UserProfile {
  displayName: string;
  email:       string;
  role:        UserRole;
  dept:        string;
  score:       number;
  votedItems:  string[];
}

/* ── Context 타입 ── */
interface AuthContextType {
  user:    User | null;
  profile: UserProfile | null;
  loading: boolean;
  login:         (email: string, password: string) => Promise<void>;
  loginGoogle:   () => Promise<void>;
  register:      (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout:        () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, loading: true,
  login: async () => {}, loginGoogle: async () => {},
  register: async () => {}, logout: async () => {},
});

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Firestore 프로필 로드 */
  const loadProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  };

  /* Auth 상태 감시 */
  useEffect(() => {
    if (!auth) {
      // Firebase 초기화 실패 시 로딩 해제
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await loadProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /* 이메일 로그인 */
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  /* Google 로그인 */
  const loginGoogle = async () => {
    if (!auth || !db) throw new Error('Firebase가 초기화되지 않았습니다.');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || '사용자',
        email:       cred.user.email,
        role:        'student' as UserRole,
        dept:        'KBU 디자인학과',
        score:       0,
        votedItems:  [],
        createdAt:   serverTimestamp(),
      });
    }
  };

  /* 회원가입 */
  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
  ) => {
    if (!auth || !db) throw new Error('Firebase가 초기화되지 않았습니다.');
    const ROLE_DEPT: Record<UserRole, string> = {
      student:    'KBU 디자인학과',
      professor:  'KBU 디자인학과 교수진',
      industry:   '산학협력 멘토',
      researcher: 'HCI / HCAI 연구',
    };
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName,
      email,
      role,
      dept:       ROLE_DEPT[role],
      score:      0,
      votedItems: [],
      createdAt:  serverTimestamp(),
    });
  };

  /* 로그아웃 */
  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
