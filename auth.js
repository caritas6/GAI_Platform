/* ═══════════════════════════════════════
   G·A·I Platform — auth.js v0.4
   로그인 · 역할 선택 · 회원가입
   ═══════════════════════════════════════ */

import { auth, db, doc, setDoc, getDoc, serverTimestamp, showToast }
  from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
         GoogleAuthProvider, signInWithPopup }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const ROLE_META = {
  student:    { label:'학생',         dept:'KBU 디자인학과 디자인 전공' },
  professor:  { label:'교수 · 교육자', dept:'KBU 디자인학과 교수진' },
  industry:   { label:'산업체 파트너', dept:'산학협력 멘토' },
  researcher: { label:'외부 연구자',   dept:'HCI / HCAI 연구' }
};

let selectedRole = 'student';

/* ── 역할 카드 선택 ── */
export function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-card-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.role === role);
  });
}

/* ── 이메일 로그인 ── */
export async function loginWithEmail(email, password) {
  setLoading(true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await afterLogin(cred.user);
  } catch (e) {
    showToast('로그인 오류: ' + e.message);
    setLoading(false);
  }
}

/* ── Google 로그인 ── */
export async function loginWithGoogle() {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await afterLogin(cred.user);
  } catch (e) {
    showToast('Google 로그인 오류: ' + e.message);
    setLoading(false);
  }
}

/* ── 회원가입 ── */
export async function register(email, password, displayName) {
  if (!selectedRole) { showToast('역할을 선택해주세요.'); return; }
  setLoading(true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    /* Firestore 프로필 생성 */
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName,
      email,
      role:        selectedRole,
      dept:        ROLE_META[selectedRole].dept,
      score:       0,
      votedItems:  [],
      createdAt:   serverTimestamp()
    });
    await afterLogin(cred.user);
  } catch (e) {
    showToast('회원가입 오류: ' + e.message);
    setLoading(false);
  }
}

/* ── 로그인 후처리 ── */
async function afterLogin(user) {
  /* 프로필 없으면 역할 선택 화면 유지 */
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) {
    showToast('프로필을 생성하려면 회원가입을 완료하세요.');
    setLoading(false);
    return;
  }
  location.href = 'dashboard.html';
}

/* ── UI 헬퍼 ── */
function setLoading(on) {
  const btn = document.getElementById('login-btn');
  if (!btn) return;
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="loading-spinner"></span>&nbsp;연결 중...'
    : '시작하기';
}

/* ── 탭 전환 (로그인 / 회원가입) ── */
export function switchTab(tab) {
  document.getElementById('tab-login')?.classList.toggle('active', tab === 'login');
  document.getElementById('tab-register')?.classList.toggle('active', tab === 'register');
  document.getElementById('form-login')?.style.setProperty('display', tab === 'login' ? 'block' : 'none');
  document.getElementById('form-register')?.style.setProperty('display', tab === 'register' ? 'block' : 'none');
}
