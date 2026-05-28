'use client';

import { useState } from 'react';
import { Card, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';

type ProjectStatus = '모집중' | '진행중' | '완료';

interface Project {
  id: number;
  title: string;
  company: string;
  field: string;
  teamSize: string;
  duration: string;
  status: ProjectStatus;
  tags: { label: string; variant: 'green' | 'purple' | 'orange' | 'amber' | 'gray' }[];
  description?: string;
  items?: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: '대학·지역사회 연계 디자인 프로젝트 사업',
    company: 'KBU · 경기도경제과학진흥원',
    field: '서비스디자인',
    teamSize: '다수',
    duration: '상시',
    status: '진행중',
    description: '다학제적 융합으로 진행된 대학 교육과 기업, 지자체와의 협업 프로젝트 사업.',
    items: [
      '다학제적 융합 프로젝트',
      '지역 기업&대학 연계 브랜딩 사업',
      '디자인재능나눔사업',
      '대학·지역사회 연계 미디어리터러시 프로그램',
    ],
    tags: [
      { label: '산학협력', variant: 'green' },
      { label: '지역사회', variant: 'amber' },
    ],
  },
  {
    id: 2,
    title: '학교기업: 대학·지역사회 연계 콘텐츠 플랫폼 사업',
    company: '경북대학교',
    field: '콘텐츠',
    teamSize: '학과 단위',
    duration: '상시',
    status: '진행중',
    description: '학생들의 현장실습 및 인턴쉽 교육으로 전공/진로 탐색의 기회 제공',
    items: [
      '경북대학교 영상미디어콘텐츠학과 기업 — 미디어콘텐츠 제작센터',
    ],
    tags: [
      { label: '현장실습', variant: 'green' },
      { label: '인턴쉽', variant: 'purple' },
    ],
  },
  {
    id: 3,
    title: '스마트홈 UX 리디자인',
    company: '삼성전자',
    field: 'UX/UI',
    teamSize: '3~5인',
    duration: '1학기',
    status: '모집중',
    tags: [
      { label: '인터랙션', variant: 'purple' },
      { label: '프로토타입', variant: 'amber' },
    ],
  },
  {
    id: 4,
    title: 'AR 내비게이션 콘셉트',
    company: '현대자동차',
    field: '실감콘텐츠',
    teamSize: '2~4인',
    duration: '1학기',
    status: '모집중',
    tags: [
      { label: 'XR', variant: 'orange' },
      { label: '공간디자인', variant: 'purple' },
    ],
  },
  {
    id: 5,
    title: '공공 키오스크 접근성 개선',
    company: '서울시',
    field: '서비스디자인',
    teamSize: '4인',
    duration: '1년',
    status: '진행중',
    tags: [
      { label: '접근성', variant: 'green' },
      { label: '공공', variant: 'amber' },
    ],
  },
  {
    id: 6,
    title: '지속가능 패키지 브랜딩',
    company: '풀무원',
    field: 'UX/UI',
    teamSize: '3~6인',
    duration: '1학기',
    status: '모집중',
    tags: [
      { label: '브랜딩', variant: 'purple' },
      { label: '패키지', variant: 'green' },
    ],
  },
  {
    id: 7,
    title: 'XR 문화유산 체험 시스템',
    company: '문화재청',
    field: '실감콘텐츠',
    teamSize: '3~5인',
    duration: '1년',
    status: '완료',
    tags: [
      { label: 'XR', variant: 'orange' },
      { label: '문화', variant: 'amber' },
    ],
  },
];

const statusColor: Record<ProjectStatus, { bg: string; color: string }> = {
  모집중: { bg: 'var(--green-bg)', color: 'var(--green-text)' },
  진행중: { bg: 'var(--gray-bg)', color: 'var(--gray-text)' },
  완료: { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' },
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [fieldFilter, setFieldFilter] = useState('전체 분야');
  const [statusFilter, setStatusFilter] = useState('모집 중');
  const [companyTypes, setCompanyTypes] = useState({ 대기업: true, 스타트업: true, 공공기관: false });
  const [duration, setDuration] = useState('1학기');

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.includes(search) || p.company.includes(search);
    const matchField = fieldFilter === '전체 분야' || p.field === fieldFilter;
    const matchStatus =
      statusFilter === '전체' ||
      (statusFilter === '모집 중' && p.status === '모집중') ||
      (statusFilter === '진행 중' && p.status === '진행중') ||
      (statusFilter === '완료' && p.status === '완료');
    return matchSearch && matchField && matchStatus;
  });

  return (
    <div>
      {/* 검색 & 필터 바 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="프로젝트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)}>
          <option>전체 분야</option>
          <option>UX/UI</option>
          <option>영상</option>
          <option>실감콘텐츠</option>
          <option>서비스디자인</option>
          <option>콘텐츠</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>모집 중</option>
          <option>진행 중</option>
          <option>완료</option>
          <option>전체</option>
        </select>
      </div>

      {/* 2단 레이아웃: 필터 사이드바 + 목록 */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
        {/* 사이드바 필터 */}
        <div
          style={{
            borderRight: '0.5px solid var(--color-border)',
            paddingRight: 12,
          }}
        >
          <SectionLabel>필터</SectionLabel>

          <p
            style={{
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              margin: '8px 0 4px',
              fontWeight: 500,
            }}
          >
            기업 규모
          </p>
          {(['대기업', '스타트업', '공공기관'] as const).map((t) => (
            <label
              key={t}
              style={{ fontSize: 11, display: 'block', marginBottom: 4, cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={companyTypes[t]}
                onChange={(e) =>
                  setCompanyTypes((prev) => ({ ...prev, [t]: e.target.checked }))
                }
                style={{ marginRight: 6 }}
              />
              {t}
            </label>
          ))}

          <p
            style={{
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              margin: '10px 0 4px',
              fontWeight: 500,
            }}
          >
            기간
          </p>
          {['1학기', '1년'].map((d) => (
            <label
              key={d}
              style={{ fontSize: 11, display: 'block', marginBottom: 4, cursor: 'pointer' }}
            >
              <input
                type="radio"
                name="duration"
                checked={duration === d}
                onChange={() => setDuration(d)}
                style={{ marginRight: 6 }}
              />
              {d}
            </label>
          ))}
        </div>

        {/* 프로젝트 목록 */}
        <div>
          <SectionLabel>
            프로젝트 목록{' '}
            <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
              ({filtered.length}건)
            </span>
          </SectionLabel>

          {filtered.map((p) => (
            <Card key={p.id} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      margin: '0 0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {p.title}
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 4,
                        ...statusColor[p.status],
                      }}
                    >
                      {p.status}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 6px',
                    }}
                  >
                    {p.company} · {p.field} · {p.teamSize} · {p.duration}
                  </p>
                  {p.description && (
                    <p style={{
                      fontSize: 11, color: 'var(--color-text-secondary)',
                      margin: '0 0 6px', lineHeight: 1.5,
                    }}>
                      {p.description}
                    </p>
                  )}
                  {p.items && p.items.length > 0 && (
                    <ul style={{
                      margin: '0 0 8px', padding: 0,
                      listStyle: 'none',
                      borderLeft: '2px solid var(--brand)',
                      paddingLeft: 10,
                    }}>
                      {p.items.map((item) => (
                        <li key={item} style={{
                          fontSize: 10, color: 'var(--color-text-secondary)',
                          lineHeight: 1.6,
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div>
                    {p.tags.map((tag) => (
                      <Tag key={tag.label} variant={tag.variant}>
                        {tag.label}
                      </Tag>
                    ))}
                  </div>
                </div>
                <Button
                  variant={p.status === '모집중' ? 'primary' : 'default'}
                  style={{ marginLeft: 12, flexShrink: 0 }}
                >
                  {p.status === '모집중' ? '지원하기' : '상세보기'}
                </Button>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p
              style={{
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
                textAlign: 'center',
                padding: '32px 0',
              }}
            >
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
