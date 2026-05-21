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
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/* ── 인앱 WebView 감지 (진짜 WebView만 — 일반 Chrome/Safari 제외) ── */
function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  // 명시적 인앱 브라우저: 카카오톡, 인스타그램, 네이버앱, 라인, 페이스북, 트위터, WeChat
  if (/KAKAOTALK|NAVER|Instagram|FBAV|FB\/|FBAN|Line\/|Twitter|MicroMessenger/i.test(ua)) return true;
  // Android WebView (Chrome 아님) — wv 플래그 있고 Chrome/ 없음
  if (/Android/i.test(ua) && /wv\b/i.test(ua) && !/Chrome\//i.test(ua)) return true;
  return false;
  // ⚠️ 일반 Android Chrome / iOS Safari 는 여기서 false → signInWithPopup 사용
}

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
  /** true = signInWithRedirect 사용(페이지가 Google로 이동), false = popup 완료 */
  loginGoogle:   () => Promise<boolean>;
  register:      (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout:        () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, loading: true,
  login: async () => {}, loginGoogle: async () => false,
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
      setLoading(false);
      return;
    }

    // 모바일 리다이렉트 로그인 후 결과 처리
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && db) {
          const snap = await getDoc(doc(db, 'users', result.user.uid));
          if (!snap.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
              displayName: result.user.displayName || result.user.email?.split('@')[0] || '사용자',
              email:       result.user.email,
              role:        'student' as UserRole,
              dept:        'KBU 디자인학과',
              score:       0,
              votedItems:  [],
              createdAt:   serverTimestamp(),
            });
          }
        }
      })
      .catch((e) => console.warn('[Firebase] redirect result 오류:', e));

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

  /* Google 로그인 — true: redirect 진행 중, false: popup 완료 */
  const loginGoogle = async (): Promise<boolean> => {
    if (!auth || !db) throw new Error('Firebase가 초기화되지 않았습니다.');
    const provider = new GoogleAuthProvider();

    // 인앱 WebView → signInWithRedirect (팝업 불가 환경만)
    // 일반 Chrome/Safari 는 signInWithPopup 사용
    if (isInAppBrowser()) {
      await signInWithRedirect(auth, provider);
      return true; // 페이지가 Google로 이동, 호출부에서 router.replace 금지
    }

    // 데스크톱 → signInWithPopup
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
    return false;
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
