'use client';

import { Card, StatCard, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      {/* 상단 통계 3칸 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <StatCard label="참여 프로젝트" value="3" sub="진행 중 2 / 완료 1" />
        <StatCard label="AI Agent 세션" value="14" sub="이번 주 +3" />
        <StatCard label="DAO 기여 점수" value="248" sub="상위 12%" />
      </div>

      {/* 현재 프로젝트 + AI 피드백 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 10,
        }}
      >
        {/* 현재 프로젝트 */}
        <Card>
          <SectionLabel>현재 프로젝트</SectionLabel>

          <div
            style={{
              padding: '10px 0',
              borderBottom: '0.5px solid var(--color-border)',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: '0 0 3px',
              }}
            >
              스마트홈 UX 리디자인
            </p>
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0 }}>
              삼성전자 · 팀 4인
            </p>
            <ProgressBar percent={65} color="#1D9E75" />
          </div>

          <div style={{ padding: '10px 0 0' }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: '0 0 3px',
              }}
            >
              AR 내비게이션 프로토타입
            </p>
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0 }}>
              현대자동차 · 팀 3인
            </p>
            <ProgressBar percent={30} color="#EF9F27" />
          </div>
        </Card>

        {/* AI Agent 최근 피드백 */}
        <Card>
          <SectionLabel>AI Agent 최근 피드백</SectionLabel>
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              fontSize: 11,
              lineHeight: 1.6,
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              marginBottom: 6,
            }}
          >
            사용자 흐름 3단계에서 인지 부하가 높습니다. 정보 그룹핑을 재검토해보세요.
          </div>
          <p
            style={{
              fontSize: 10,
              color: 'var(--color-text-tertiary)',
              marginBottom: 10,
            }}
          >
            2시간 전
          </p>
          <Button variant="primary" onClick={() => router.push('/agent')}>
            Agent와 계속 대화 ↗
          </Button>
        </Card>
      </div>

      {/* DAO 최신 안건 */}
      <Card>
        <SectionLabel>DAO 최신 안건</SectionLabel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>
            [투표중] 2025-2학기 산학 평가 기준 개정안
          </span>
          <span style={{ fontSize: 11, color: '#D85A30', fontWeight: 600 }}>마감 D-2</span>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <Tag variant="green">찬성 68%</Tag>
          <Tag variant="purple">투표 참여 가능</Tag>
        </div>
      </Card>
    </div>
  );
}
