/* ═══════════════════════════════════════
   G·A·I Platform — firebase.js v0.4
   Firebase 초기화 · 공통 유틸
   ═══════════════════════════════════════
   ⚠️  아래 firebaseConfig를 본인의 Firebase
       프로젝트 설정값으로 교체하세요.
       Firebase Console → 프로젝트 설정 → 앱 추가
   ═══════════════════════════════════════ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection,
         addDoc, getDocs, onSnapshot, serverTimestamp, increment,
         query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ── Firebase 설정 (본인 프로젝트로 교체) ── */
const firebaseConfig = {
  apiKey: "AIzaSyCoNHbZNqiDil3nFDk1Ry2MIoUSPnDZ8A8",
  authDomain: "g-a-i2026.firebaseapp.com",
  projectId: "g-a-i2026",
  storageBucket: "g-a-i2026.appspot.com",
  messagingSenderId: "903996714406",
  appId: "1:903996714406:web:4dce52554343d00bf47367",
  measurementId: "G-TZV926FH73"
};

/* ── 초기화 ── */
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ── 전역 플랫폼 상태 ── */
export const GAI = {
  user: null,      /* Firebase Auth user */
  profile: null,   /* Firestore /users/{uid} */
  role: null,      /* student | professor | industry | researcher */
  score: 0,
  votedItems: new Set(),

  /* 로그아웃 */
  async logout() {
    await signOut(auth);
    sessionStorage.clear();
    location.href = 'index.html';
  },

  /* 현재 사용자 점수 새로고침 */
  async refreshScore() {
    if (!this.user) return;
    const snap = await getDoc(doc(db, 'users', this.user.uid));
    if (snap.exists()) {
      this.score = snap.data().score || 0;
      document.querySelectorAll('.dao-score-val')
        .forEach(el => el.textContent = this.score);
    }
  }
};

/* ── Auth 상태 감시 (공통) ── */
export function guardAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { location.href = 'index.html'; return; }
    GAI.user = user;

    /* Firestore 프로필 로드 */
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      GAI.profile = snap.data();
      GAI.role    = GAI.profile.role;
      GAI.score   = GAI.profile.score || 0;
      GAI.votedItems = new Set(GAI.profile.votedItems || []);
      applyProfileToUI(GAI.profile);
    } else {
      /* 프로필 없으면 로그인으로 */
      location.href = 'index.html';
      return;
    }

    if (callback) callback(user, GAI.profile);
  });
}

/* ── UI에 프로필 적용 ── */
export function applyProfileToUI(profile) {
  const colorMap = {
    student:    { bg:'var(--purple-l)', fg:'var(--purple)', init:'학생' },
    professor:  { bg:'var(--teal-l)',   fg:'var(--teal)',   init:'교수' },
    industry:   { bg:'var(--coral-l)',  fg:'var(--coral)',  init:'기업' },
    researcher: { bg:'var(--pink-l)',   fg:'var(--pink)',   init:'연구' }
  };
  const c = colorMap[profile.role] || colorMap.student;

  const av   = document.getElementById('sb-avatar');
  const name = document.getElementById('sb-name');
  const dept = document.getElementById('sb-dept');
  const rb   = document.getElementById('role-badge');

  if (av)   { av.textContent = c.init; av.style.background = c.bg; av.style.color = c.fg; }
  if (name) name.textContent = profile.displayName || '사용자';
  if (dept) dept.textContent = profile.dept || 'KBU 디자인학과';
  if (rb)   rb.textContent   = profile.role === 'student'    ? '학생' :
                                profile.role === 'professor'  ? '교수 · 교육자' :
                                profile.role === 'industry'   ? '산업체 파트너' : '외부 연구자';

  /* 역할 기반 DAO 점수 표시 */
  document.querySelectorAll('.dao-score-val')
    .forEach(el => el.textContent = profile.score || 0);

  /* Firebase 연결 상태 표시 */
  document.querySelectorAll('.fb-status')
    .forEach(el => { el.textContent = '🔴 Firebase 연결됨'; el.className = 'fb-status fb-live'; });
}

/* ── Firestore 헬퍼 ── */

/** 기여 점수 추가 + Firestore 업데이트 */
export async function addScore(uid, amount, label) {
  await updateDoc(doc(db, 'users', uid), {
    score: increment(amount)
  });
  await addDoc(collection(db, 'users', uid, 'contributions'), {
    label,
    score: amount,
    createdAt: serverTimestamp()
  });
  GAI.score += amount;
  document.querySelectorAll('.dao-score-val')
    .forEach(el => el.textContent = GAI.score);
}

/** 기여 이력 실시간 구독 */
export function watchContributions(uid, callback) {
  const q = query(
    collection(db, 'users', uid, 'contributions'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

/** DAO 투표 데이터 실시간 구독 */
export function watchVotes(callback) {
  return onSnapshot(collection(db, 'votes'), (snap) => {
    const votes = {};
    snap.docs.forEach(d => { votes[d.id] = { id: d.id, ...d.data() }; });
    callback(votes);
  });
}

/** 투표 실행 */
export async function castVoteFS(uid, voteId, isFor) {
  const voteRef = doc(db, 'votes', voteId);
  const userRef = doc(db, 'users', uid);

  /* 중복 방지 */
  if (GAI.votedItems.has(voteId)) return false;

  /* Firestore 원자적 업데이트 */
  await updateDoc(voteRef, {
    [isFor ? 'pro' : 'con']: increment(1),
    total: increment(1)
  });
  const newVoted = [...GAI.votedItems, voteId];
  await updateDoc(userRef, { votedItems: newVoted, score: increment(10) });
  GAI.votedItems.add(voteId);

  return true;
}

/** 프로젝트 목록 불러오기 */
export async function getProjects(filters = {}) {
  const snap = await getDocs(collection(db, 'projects'));
  let projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (filters.status) projects = projects.filter(p => p.status === filters.status);
  if (filters.type)   projects = projects.filter(p => p.type   === filters.type);
  return projects;
}

/** 포트폴리오 목록 불러오기 */
export async function getPortfolios() {
  const snap = await getDocs(
    query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** 토스트 메시지 */
export function showToast(msg) {
  let t = document.getElementById('gai-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'gai-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.style.opacity = '0', 2800);
}

/** detail-panel 토글 */
export function toggleDetail(id) {
  document.getElementById(id)?.classList.toggle('open');
}

/* Firebase export */
export { auth, db, doc, getDoc, setDoc, updateDoc, collection,
         addDoc, getDocs, onSnapshot, serverTimestamp, increment,
         onAuthStateChanged, signOut, query, orderBy, limit };
