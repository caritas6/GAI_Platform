'use client';

import { useState } from 'react';
import { Card, StatCard, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';

interface Vote {
  id: number;
  title: string;
  deadline: string;
  agree: number;
  voted: boolean;
}

const initialVotes: Vote[] = [
  { id: 1, title: '2025-2 평가 기준 개정', deadline: 'D-2', agree: 68, voted: false },
  { id: 2, title: '신규 산업체 파트너 승인', deadline: 'D-5', agree: 84, voted: false },
  { id: 3, title: 'AI Agent 사용 가이드라인', deadline: 'D-9', agree: 51, voted: false },
];

const history = [
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

export default function DaoPage() {
  const [votes, setVotes] = useState<Vote[]>(initialVotes);

  const handleVote = (id: number) => {
    setVotes((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, voted: true, agree: Math.min(100, v.agree + 2) }
          : v
      )
    );
  };

  return (
    <div>
      {/* 상단 통계 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <StatCard label="내 기여 점수" value="248" sub="프로젝트 +180 / 투표 +68" />
        <StatCard label="보유 뱃지" value="7" sub="이번 학기 +2" />
        <StatCard label="투표 참여율" value="92%" sub="전체 평균 74%" />
      </div>

      {/* 투표 + 기여 이력 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* 진행 중인 투표 */}
        <Card>
          <SectionLabel>진행 중인 투표</SectionLabel>

          {votes.map((v) => (
            <div
              key={v.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 3px',
                  }}
                >
                  {v.title}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 4px',
                  }}
                >
                  마감 {v.deadline} · 찬성 {v.agree}%
                </p>
                <div
                  style={{
                    height: 6,
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      width: `${v.agree}%`,
                      background: '#1D9E75',
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
              <Button
                variant={v.voted ? 'default' : 'primary'}
                onClick={() => !v.voted && handleVote(v.id)}
                style={{ flexShrink: 0 }}
              >
                {v.voted ? '완료 ✓' : '투표'}
              </Button>
            </div>
          ))}
        </Card>

        {/* 기여 이력 + 뱃지 */}
        <Card>
          <SectionLabel>기여 이력</SectionLabel>

          {history.map((h) => (
            <div
              key={h.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {h.label}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: '#1D9E75',
                  fontWeight: 600,
                }}
              >
                {h.score}
              </span>
            </div>
          ))}

          <SectionLabel style={{ marginTop: 14 }}>보유 뱃지</SectionLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {badges.map((b) => (
              <Tag key={b.label} variant={b.variant}>
                {b.label}
              </Tag>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
