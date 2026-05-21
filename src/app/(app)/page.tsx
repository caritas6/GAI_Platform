'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { Card, StatCard, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';

/* ── 타입 ── */
interface Project {
  id:       string;
  title:    string;
  company:  string;
  teamSize: number;
  progress: number;
  status:   'active' | 'done';
  color?:   string;
}

interface VoteDoc {
  title:    string;
  pro:      number;
  con:      number;
  total:    number;
  deadline: string;
}

/* ── DAO 점수 → 상위 % 근사 계산 ── */
function getPercentile(score: number): number {
  if (score >= 500) return 5;
  if (score >= 300) return 10;
  if (score >= 200) return 15;
  if (score >= 100) return 25;
  if (score >= 50)  return 40;
  return 60;
}

export default function HomePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [projects,      setProjects]      = useState<Project[]>([]);
  const [agentSessions, setAgentSessions] = useState<number | null>(null);
  const [vote,          setVote]          = useState<VoteDoc | null>(null);
  const [loadingProj,   setLoadingProj]   = useState(true);
  const [loadingVote,   setLoadingVote]   = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setLoadingProj(false);
      setLoadingVote(false);
      return;
    }
    const unsubs: (() => void)[] = [];

    /* ① 내 참여 프로젝트 — memberUids 배열에 uid 포함된 문서 */
    const projQ = query(
      collection(db, 'projects'),
      where('memberUids', 'array-contains', user.uid),
    );
    unsubs.push(
      onSnapshot(projQ, snap => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
        setLoadingProj(false);
      }, () => setLoadingProj(false)),
    );

    /* ② 유저 프로필 실시간 (agentSessions 포함) */
    unsubs.push(
      onSnapshot(doc(db, 'users', user.uid), snap => {
        if (snap.exists()) {
          setAgentSessions(snap.data().agentSessions ?? 0);
        }
      }),
    );

    /* ③ DAO 투표 v1 실시간 */
    unsubs.push(
      onSnapshot(doc(db, 'votes', 'v1'), snap => {
        setVote(snap.exists() ? (snap.data() as VoteDoc) : null);
        setLoadingVote(false);
      }, () => setLoadingVote(false)),
    );

    return () => unsubs.forEach(u => u());
  }, [user]);

  /* 파생 값 */
  const activeCount = projects.filter(p => p.status === 'active').length;
  const doneCount   = projects.filter(p => p.status === 'done').length;
  const daoScore    = profile?.score ?? 0;
  const votePct     = vote ? Math.round((vote.pro / Math.max(vote.total, 1)) * 100) : 0;

  return (
    <div>
      {/* ── 상단 통계 3칸 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatCard
          label="참여 프로젝트"
          value={loadingProj ? '—' : projects.length}
          sub={loadingProj ? '로딩 중...' : `진행 중 ${activeCount} / 완료 ${doneCount}`}
        />
        <StatCard
          label="AI Agent 세션"
          value={agentSessions === null ? '—' : agentSessions}
          sub="누적 대화 세션"
        />
        <StatCard
          label="DAO 기여 점수"
          value={daoScore}
          sub={daoScore > 0 ? `상위 ${getPercentile(daoScore)}%` : '활동을 시작해보세요'}
        />
      </div>

      {/* ── 현재 프로젝트 + AI 피드백 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>

        {/* 현재 프로젝트 */}
        <Card>
          <SectionLabel>현재 프로젝트</SectionLabel>

          {loadingProj ? (
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', padding: '12px 0' }}>
              로딩 중...
            </p>
          ) : projects.length === 0 ? (
            /* 참여 프로젝트 없을 때 */
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 12 }}>
                아직 참여 중인 프로젝트가 없어요.
              </p>
              <Button variant="primary" onClick={() => router.push('/projects')}>
                프로젝트 참여하기 →
              </Button>
            </div>
          ) : (
            <>
              {projects.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    padding: '10px 0',
                    borderBottom: i < projects.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 3px' }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0 }}>
                    {p.company} · 팀 {p.teamSize}인
                  </p>
                  <ProgressBar
                    percent={p.progress ?? 0}
                    color={p.color ?? (p.status === 'done' ? '#9999B0' : '#1D9E75')}
                  />
                </div>
              ))}
              {projects.length > 3 && (
                <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                  외 {projects.length - 3}개 프로젝트
                </p>
              )}
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => router.push('/projects')}>전체 프로젝트 보기 →</Button>
              </div>
            </>
          )}
        </Card>

        {/* AI Agent 최근 피드백 */}
        <Card>
          <SectionLabel>AI Agent 최근 피드백</SectionLabel>
          <div
            style={{
              padding: '8px 10px', borderRadius: 8, fontSize: 11, lineHeight: 1.6,
              background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', marginBottom: 6,
            }}
          >
            {profile?.role === 'professor'
              ? '이번 주 학생 AI 활용 세션이 증가했어요. 과제 연계 분석 결과를 확인해보세요.'
              : profile?.role === 'industry'
              ? '최근 등록된 프로젝트에 UX 전공 학생 3명이 매칭 대기 중이에요.'
              : profile?.role === 'researcher'
              ? 'DAO 투표 참여율이 이번 주 18% 상승했습니다. 데이터를 열람하세요.'
              : '사용자 흐름 3단계에서 인지 부하가 높습니다. 정보 그룹핑을 재검토해보세요.'
            }
          </div>
          <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 10 }}>
            {agentSessions !== null && agentSessions > 0
              ? `총 ${agentSessions}회 대화 · 방금 전`
              : 'AI Agent와 첫 대화를 시작해보세요'}
          </p>
          <Button variant="primary" onClick={() => router.push('/agent')}>
            Agent와 계속 대화 ↗
          </Button>
        </Card>
      </div>

      {/* ── DAO 최신 안건 ── */}
      <Card>
        <SectionLabel>DAO 최신 안건</SectionLabel>

        {loadingVote ? (
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>로딩 중...</p>
        ) : vote ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-primary)', margin: '0 0 8px', fontWeight: 500 }}>
                [투표중] {vote.title}
              </p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <Tag variant="green">찬성 {votePct}%</Tag>
                <Tag variant="purple">
                  {profile?.votedItems?.includes('v1') ? '투표 완료' : '투표 참여 가능'}
                </Tag>
              </div>
              {/* 투표 현황 바 */}
              <div style={{ height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 2, overflow: 'hidden', maxWidth: 200 }}>
                <div style={{ height: '100%', width: `${votePct}%`, background: '#1D9E75', borderRadius: 2, transition: 'width .7s' }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                참여 {vote.total}명
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              {vote.deadline && (
                <span style={{ fontSize: 11, color: '#D85A30', fontWeight: 600 }}>
                  마감 {vote.deadline}
                </span>
              )}
              <Button onClick={() => router.push('/dao')}>투표하기</Button>
            </div>
          </div>
        ) : (
          /* 투표 데이터 없을 때 */
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              현재 진행 중인 안건이 없어요.
            </p>
            <Button onClick={() => router.push('/dao')}>DAO 보드 가기 →</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
