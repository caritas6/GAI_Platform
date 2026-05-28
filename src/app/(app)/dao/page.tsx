'use client';

import { useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot,
  updateDoc, arrayUnion, increment,
} from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { Card, StatCard, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';

interface VoteItem {
  id: string;
  title: string;
  deadline: string;
  agree: number;
  total: number;
}

const historyFallback = [
  { label: '스마트홈 UX 결과물 제출', score: '+60' },
  { label: '평가 기준 개정안 투표', score: '+10' },
  { label: '팀원 피드백 작성', score: '+20' },
  { label: '리서치 리포트 공유', score: '+30' },
];

const badges = [
  { label: '첫 프로젝트', variant: 'purple' as const },
  { label: '우수 기여자', variant: 'green' as const },
  { label: '멘토링 완료', variant: 'amber' as const },
  { label: '피드백왕', variant: 'orange' as const },
];

/* Firestore votes 컬렉션이 없을 때 보여줄 로컬 fallback */
const localVotes: VoteItem[] = [
  { id: 'local-1', title: '2025-2 평가 기준 개정', deadline: 'D-2', agree: 68, total: 45 },
  { id: 'local-2', title: '신규 산업체 파트너 승인', deadline: 'D-5', agree: 84, total: 62 },
  { id: 'local-3', title: 'AI Agent 사용 가이드라인', deadline: 'D-9', agree: 51, total: 38 },
];

export default function DaoPage() {
  const { user, profile } = useAuth();

  const [votes, setVotes]         = useState<VoteItem[]>(localVotes);
  const [votedIds, setVotedIds]   = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [useFirestore, setUseFirestore] = useState(false);

  /* ── Firestore 투표 목록 실시간 구독 ── */
  useEffect(() => {
    if (!user || !db) return;

    // profile의 votedItems로 투표 완료 목록 초기화
    if (profile?.votedItems) {
      setVotedIds(new Set(profile.votedItems));
    }

    const unsub = onSnapshot(
      collection(db, 'dao_votes'),
      (snap) => {
        if (!snap.empty) {
          setVotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as VoteItem)));
          setUseFirestore(true);
        }
        // 컬렉션 없으면 localVotes 유지
      },
      () => { /* 에러 시 localVotes 유지 */ },
    );
    return unsub;
  }, [user, profile]);

  /* ── 투표 처리 ── */
  const handleVote = async (vote: VoteItem) => {
    if (votedIds.has(vote.id) || loadingId) return;
    setLoadingId(vote.id);

    // 로컬 상태 즉시 반영 (optimistic update)
    setVotes(prev => prev.map(v =>
      v.id === vote.id
        ? { ...v, agree: Math.min(100, v.agree + 2), total: v.total + 1 }
        : v,
    ));
    setVotedIds(prev => new Set([...prev, vote.id]));

    // Firestore 반영 (연동된 경우만)
    if (useFirestore && db && user) {
      try {
        await updateDoc(doc(db, 'dao_votes', vote.id), {
          agree: increment(2),
          total: increment(1),
        });
        await updateDoc(doc(db, 'users', user.uid), {
          votedItems: arrayUnion(vote.id),
          score: increment(10),
        });
      } catch { /* 오프라인 등 에러 무시 */ }
    }

    setLoadingId(null);
  };

  const daoScore   = profile?.score ?? 0;
  const voteCount  = votedIds.size;
  const totalVotes = votes.length;
  const participation = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <div>
      {/* 상단 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatCard
          label="내 기여 점수"
          value={daoScore}
          sub={`프로젝트 +${Math.max(0, daoScore - voteCount * 10)} / 투표 +${voteCount * 10}`}
        />
        <StatCard
          label="보유 뱃지"
          value={badges.length}
          sub="이번 학기 +2"
        />
        <StatCard
          label="투표 참여율"
          value={`${participation}%`}
          sub={`${voteCount}/${totalVotes}건 참여`}
        />
      </div>

      {/* 투표 + 기여 이력 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* 진행 중인 투표 */}
        <Card>
          <SectionLabel>
            진행 중인 투표
            {!useFirestore && (
              <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)', fontWeight: 400, marginLeft: 6 }}>
                (샘플 데이터)
              </span>
            )}
          </SectionLabel>

          {votes.map((v) => {
            const voted = votedIds.has(v.id);
            const pct   = Math.min(100, Math.round((v.agree / Math.max(v.total, 1)) * 100));

            return (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 3px' }}>
                    {v.title}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>
                    마감 {v.deadline} · 찬성 {pct}% · {v.total}명 참여
                  </p>
                  <div style={{ height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: 6, width: `${pct}%`,
                      background: '#1D9E75', borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
                <Button
                  variant={voted ? 'default' : 'primary'}
                  onClick={() => !voted && handleVote(v)}
                  style={{ flexShrink: 0, opacity: loadingId === v.id ? 0.6 : 1 }}
                >
                  {loadingId === v.id ? '...' : voted ? '완료 ✓' : '투표'}
                </Button>
              </div>
            );
          })}
        </Card>

        {/* 기여 이력 + 뱃지 */}
        <Card>
          <SectionLabel>기여 이력</SectionLabel>

          {historyFallback.map((h) => (
            <div key={h.label} style={{
              display: 'flex', alignItems: 'center',
              padding: '8px 0', borderBottom: '0.5px solid var(--color-border)',
            }}>
              <div style={{ flex: 1, fontSize: 11, color: 'var(--color-text-secondary)' }}>
                {h.label}
              </div>
              <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 600 }}>
                {h.score}
              </span>
            </div>
          ))}

          <SectionLabel style={{ marginTop: 14 }}>보유 뱃지</SectionLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {badges.map((b) => (
              <Tag key={b.label} variant={b.variant}>{b.label}</Tag>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
