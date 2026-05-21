/* ═══════════════════════════════════════
   G·A·I Platform — dao.js v0.4
   DAO 투표 · 기여 이력 · 실시간 연동
   ═══════════════════════════════════════ */

import { GAI, db, watchVotes, watchContributions, castVoteFS,
         addScore, showToast, doc, setDoc, serverTimestamp }
  from './firebase.js';

/* ── DAO 투표 실시간 렌더링 ── */
export function initDAO() {
  /* 투표 목록 실시간 구독 */
  watchVotes((votes) => {
    Object.values(votes).forEach(v => renderVoteItem(v));
  });

  /* 기여 이력 실시간 구독 */
  if (GAI.user) {
    watchContributions(GAI.user.uid, (items) => {
      renderContributions(items);
    });
  }
}

/* ── 단일 투표 항목 렌더링 ── */
function renderVoteItem(v) {
  const el = document.getElementById('vote-' + v.id);
  if (!el) return;

  const pct   = Math.round((v.pro || 0) / Math.max(v.total || 1, 1) * 100);
  const voted = GAI.votedItems.has(v.id);

  el.querySelector('.vote-bar-fill').style.width  = pct + '%';
  el.querySelector('.vote-count').textContent =
    `참여 ${v.total || 0}명 · 찬성 ${pct}% · 마감 ${v.deadline || ''}`;

  /* 투표 완료 상태 반영 */
  el.querySelectorAll('.vote-action-btn').forEach(b => {
    b.disabled      = voted;
    b.style.opacity = voted ? '0.4' : '1';
  });
  const badge = el.querySelector('.voted-badge');
  if (badge) badge.style.display = voted ? 'inline-block' : 'none';
}

/* ── 투표 실행 ── */
export async function castVote(voteId, isFor) {
  if (!GAI.user) { showToast('로그인이 필요합니다.'); return; }
  if (GAI.votedItems.has(voteId)) { showToast('이미 투표하셨습니다.'); return; }

  const ok = await castVoteFS(GAI.user.uid, voteId, isFor);
  if (ok) {
    await addScore(GAI.user.uid, 10, `[DAO 투표] 안건 참여`);
    showToast(`투표 완료 — 기여 점수 +10 적립`);
  }
}

/* ── 기여 이력 렌더링 ── */
function renderContributions(items) {
  const list = document.getElementById('contrib-list');
  if (!list) return;
  list.innerHTML = items.map(item => `
    <div class="contrib-item">
      <span>${item.label || ''}</span>
      <span class="contrib-score">+${item.score || 0}</span>
    </div>
  `).join('');
}

/* ── 신규 DAO 안건 발의 ── */
export async function proposeMotion(title, description, category) {
  if (!GAI.user) return;
  const ref = doc(db, 'votes', crypto.randomUUID());
  await setDoc(ref, {
    title, description, category,
    pro: 0, con: 0, total: 0,
    proposer: GAI.user.uid,
    deadline: 'D-14',
    status: 'active',
    createdAt: serverTimestamp()
  });
  await addScore(GAI.user.uid, 20, `[DAO 발의] ${title}`);
  showToast('안건이 발의되었습니다. 기여 점수 +20');
}

/* ── 뱃지 목록 렌더링 ── */
export function renderBadges(badges = []) {
  const el = document.getElementById('badge-list');
  if (!el) return;
  const colorMap = {
    '첫 프로젝트 완료':'tag-purple', '우수 기여자':'tag-teal',
    '멘토링 이수':'tag-amber',       '피드백 리더':'tag-coral',
    'HCI 리서처':'tag-teal',         'XR 전문가':'tag-gray',
    'DAO 액티비스트':'tag-purple'
  };
  el.innerHTML = badges.map(b =>
    `<span class="tag ${colorMap[b] || 'tag-gray'}">${b}</span>`
  ).join('');
}
