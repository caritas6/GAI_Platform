'use client';

import { useState } from 'react';
import { Card, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';

type ProjectStatus = '모집중' | '진행중' | '완료';

interface CaseGroup {
  label: string;
  items: string[];
}

interface CaseDetail {
  caseNum: string;
  title: string;
  subtitle: string;
  items: string[];
  groups?: CaseGroup[]; // 조직도·다이어그램형 콘텐츠
}

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
  cases?: CaseDetail[];
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
    cases: [
      {
        caseNum: 'PROJECT 01',
        title: '다학제적 융합 프로젝트',
        subtitle: '앨범 자켓 콜라보레이션',
        items: [
          '시각디자인학과 X 실용음악과',
          '디자인&음악의 콜라보레이션',
          '앨범 재킷 디자인 & 앨범 발매',
        ],
      },
      {
        caseNum: 'PROJECT 02',
        title: '지역 기업&대학 연계 브랜딩 사업',
        subtitle: '주)크로바_MainBrand · 위드쿡_SubBrand',
        items: [
          '지역 기업의 브랜딩 작업 + 캡스톤 디자인 수업 연계 진행',
          'MOU + 취업 연계 + 온라인 서브 브랜드 개발로 확장',
          '홈페이지 리뉴얼 작업',
        ],
      },
      {
        caseNum: 'PROJECT 03',
        title: '디자인재능나눔사업',
        subtitle: '브랜딩',
        items: [
          '중소기업 10개 참여 X 대학 X 경기도경제과학진흥원',
          '브랜딩 / 상품 패키지 디자인 / 캐릭터 디자인',
          '시제품 출시 + 지속적인 디자인 큐레이팅',
        ],
      },
      {
        caseNum: 'PROJECT 04',
        title: '대학·지역사회 연계 미디어리터러시 프로그램',
        subtitle: '다문화 초기청소년 진로 연계 미디어 리터러시 역량강화 프로그램',
        items: [
          '경북대학교 영상미디어콘텐츠과 X 한국언론진흥재단 X 남양주시 다문화가족지원센터',
          '대상 : 다문화가정 아동 및 청소년(초등학교 5, 6학년 / 중학생) 20명',
          'Week 1 _ 메타버스 크리에이터 (제페토 빌드 잇 / 생성형 AI / VR·AR 진로체험)',
          'Week 2 _ 미디어 진로 체험 (유튜브 A to Z / 스마트미디어를 활용한 영상 제작)',
        ],
      },
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
    cases: [
      {
        caseNum: 'PROJECT 01',
        title: '미디어 콘텐츠 제작센터',
        subtitle: '학교기업 설립 목적 및 기대효과',
        items: [
          '학생들의 현장실습 및 인턴십 교육의 활성화',
          '참여 학생들의 전공 및 진로 탐색의 기회 제공',
          '지역산업 육성정책에 부응하는 학교기업으로 미디어콘텐츠산업 활성화를 통해 대학 재정에 기여',
          '협력기업 및 가족 회사와 공동으로 외부프로젝트 수주 및 제작을 통한 상호 시너지 창출',
          '프로젝트 참여 학생 장학금 지급 확대로 학업성취도 고취',
          '대학의 다양한 교육프로그램을 산업화에 활용 모델 제시',
          '고부가가치 첨단 콘텐츠산업분야에 대한 대학의 역할 제고',
          '지역 로컬 크리에이터 사업화와 연계',
        ],
      },
      {
        caseNum: 'PROJECT 02',
        title: '운영방안',
        subtitle: '미디어콘텐츠 제작센터 중심 협력 구조',
        items: [],
        groups: [
          {
            label: '🎯 미디어콘텐츠 제작센터 (중심)',
            items: ['영상/실감 콘텐츠 제작', '용역 수주', '현장실습 및 실무교육', '학교 기업 운영'],
          },
          {
            label: '🏫 경북대학교 산학협력단',
            items: ['행정·재정지원', '예산집행', '업무관리'],
          },
          {
            label: '📚 경북대학교 영상미디어콘텐츠학과',
            items: ['학생 현장실습 지원', '기업 기술 지도', '현장 맞춤형 인력 양성'],
          },
          {
            label: '🏛 경기도·남양주시 유관기관',
            items: ['운영 및 자문 참여', '공동 사업 진행'],
          },
          {
            label: '🏢 유관산업체',
            items: ['현장실습 운영', '현장기술 교육 참여', '과제용역 공동추진', '로컬크리에이터 사업'],
          },
        ],
      },
      {
        caseNum: 'PROJECT 03',
        title: '수익창출 및 발전방안',
        subtitle: '지속가능한 수익 모델 구축',
        items: [
          '지역의 미디어콘텐츠제작 전문 기업 운영에 따른 영상 콘텐츠 제작',
          '영상/실감, 콘텐츠, 디자인 등 관련 용역 수주 및 수행',
          '현장실습을 통한 미디어콘텐츠 전문인력 양성',
          '고용창출 및 지역 미디어콘텐츠 산업 활성화',
          '관련기관 및 기업체와 공동 프로젝트 운영',
          '산업체 애로사항 해결에 필요한 기술지원 및 학교기업 소개',
          '영상/실감 미디어를 통한 학교기업 인지도 제고',
          '해외 수출 및 브랜드 인플루언서(외국인 졸업생 및 재학생) 사업',
          '링크 사업 및 연구지원사업 제안을 통한 연구사업 수행',
          '타과의 다학제적 융합 프로젝트 협력 의뢰를 통한 수주',
          '지자체 입찰 수주',
        ],
      },
      {
        caseNum: 'PROJECT 04',
        title: '산학협력 생태계',
        subtitle: '경북대학교 산학협력단 미디어콘텐츠 제작센터 네트워크',
        items: [],
        groups: [
          {
            label: '✨ 기대효과',
            items: ['전문인력 양성', '고용창출 및 지역환경개선', '기술이전 및 지역 경제 활성화', '산학협력 활성화'],
          },
          {
            label: '🏛 공공기관',
            items: ['경기벤처창업지원센터(경기도경제과학진흥원)', '남양주 시청자 미디어센터', '경기콘텐츠진흥원(의정부)'],
          },
          {
            label: '📺 미디어콘텐츠산업',
            items: ['영상기업', '실감 콘텐츠 기업', '뉴미디어 콘텐츠 기업'],
          },
          {
            label: '🚀 첨단 콘텐츠 산업',
            items: ['VR/AR/MR/XR', '3D 콘텐츠 산업', '실감 UX/UI 산업', '실감 영상 콘텐츠 산업'],
          },
          {
            label: '🏘 지역산업',
            items: ['지역 기업체', '로컬 크리에이터 사업'],
          },
        ],
      },
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

/* ── 상세 모달 ── */
function DetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeCase, setActiveCase] = useState(0);
  const cases = project.cases ?? [];
  const current = cases[activeCase];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720,
          background: 'var(--color-bg-primary)',
          borderRadius: '16px 16px 0 0',
          maxHeight: '88vh', overflowY: 'auto',
          padding: '24px 20px 32px',
        }}
      >
        {/* 핸들 바 */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'var(--color-border)',
          margin: '0 auto 20px',
        }} />

        {/* 헤더 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-tertiary)',
            fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4,
          }}>
            PROJECT DETAIL
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: 'var(--color-text-primary)', lineHeight: 1.4,
          }}>
            {project.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {project.company} · {project.field}
          </div>
        </div>

        {/* 케이스 탭 */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 20,
          overflowX: 'auto', paddingBottom: 2,
        }}>
          {cases.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveCase(i)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 8,
                border: activeCase === i
                  ? '1.5px solid var(--brand)'
                  : '0.5px solid var(--color-border)',
                background: activeCase === i ? 'var(--brand-light)' : 'var(--color-bg-secondary)',
                color: activeCase === i ? 'var(--brand)' : 'var(--color-text-secondary)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {c.caseNum}
            </button>
          ))}
        </div>

        {/* 케이스 본문 */}
        {current && (
          <div style={{
            background: 'var(--color-bg-secondary)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 12, padding: '20px 18px',
          }}>
            {/* case 번호 */}
            <div style={{
              fontSize: 10, color: 'var(--color-text-tertiary)',
              fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4,
            }}>
              {current.caseNum}
            </div>

            {/* 제목 */}
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 14, lineHeight: 1.4,
            }}>
              {current.title}
            </div>

            {/* 부제목 (초록 세로선) */}
            <div style={{
              borderLeft: '3px solid #2D6A4F',
              paddingLeft: 12,
              marginBottom: 18,
            }}>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--color-text-primary)', lineHeight: 1.5,
              }}>
                {current.subtitle}
              </span>
            </div>

            {/* 불릿 리스트 항목 */}
            {current.items.length > 0 && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {current.items.map((item, idx) => (
                  <li key={idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    fontSize: 13, color: 'var(--color-text-secondary)',
                    lineHeight: 1.6, marginBottom: 6,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--color-text-tertiary)',
                      marginTop: 7, flexShrink: 0,
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* 그룹 카드 (조직도·다이어그램형) */}
            {current.groups && current.groups.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.groups.map((group, gi) => (
                  <div key={gi} style={{
                    border: gi === 0
                      ? '1.5px solid var(--brand)'
                      : '0.5px solid var(--color-border)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    background: gi === 0 ? 'var(--brand-light)' : 'var(--color-bg-primary)',
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: gi === 0 ? 'var(--brand)' : 'var(--color-text-primary)',
                      marginBottom: 8,
                    }}>
                      {group.label}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {group.items.map((item, ii) => (
                        <span key={ii} style={{
                          fontSize: 11,
                          color: 'var(--color-text-secondary)',
                          background: 'var(--color-bg-secondary)',
                          border: '0.5px solid var(--color-border)',
                          borderRadius: 6, padding: '3px 8px',
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{
            marginTop: 16, width: '100%', padding: '10px',
            border: '0.5px solid var(--color-border)',
            borderRadius: 9, background: 'var(--color-bg-secondary)',
            fontSize: 13, color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/* ── 메인 페이지 ── */
export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [fieldFilter, setFieldFilter] = useState('전체 분야');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [companyTypes, setCompanyTypes] = useState({ 대기업: true, 스타트업: true, 공공기관: false });
  const [duration, setDuration] = useState('1학기');
  const [detailProject, setDetailProject] = useState<Project | null>(null);

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
      {/* 상세 모달 */}
      {detailProject && (
        <DetailModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
        />
      )}

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

      {/* 2단 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
        {/* 사이드바 필터 */}
        <div style={{ borderRight: '0.5px solid var(--color-border)', paddingRight: 12 }}>
          <SectionLabel>필터</SectionLabel>

          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '8px 0 4px', fontWeight: 500 }}>
            기업 규모
          </p>
          {(['대기업', '스타트업', '공공기관'] as const).map((t) => (
            <label key={t} style={{ fontSize: 11, display: 'block', marginBottom: 4, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={companyTypes[t]}
                onChange={(e) => setCompanyTypes((prev) => ({ ...prev, [t]: e.target.checked }))}
                style={{ marginRight: 6 }}
              />
              {t}
            </label>
          ))}

          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '10px 0 4px', fontWeight: 500 }}>
            기간
          </p>
          {['1학기', '1년'].map((d) => (
            <label key={d} style={{ fontSize: 11, display: 'block', marginBottom: 4, cursor: 'pointer' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 4px',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {p.title}
                    <span style={{
                      fontSize: 10, padding: '2px 7px',
                      borderRadius: 4, ...statusColor[p.status],
                    }}>
                      {p.status}
                    </span>
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: '0 0 6px' }}>
                    {p.company} · {p.field} · {p.teamSize} · {p.duration}
                  </p>
                  {p.description && (
                    <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '0 0 6px', lineHeight: 1.5 }}>
                      {p.description}
                    </p>
                  )}
                  {p.items && p.items.length > 0 && (
                    <ul style={{
                      margin: '0 0 8px', padding: 0, listStyle: 'none',
                      borderLeft: '2px solid var(--brand)', paddingLeft: 10,
                    }}>
                      {p.items.map((item) => (
                        <li key={item} style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div>
                    {p.tags.map((tag) => (
                      <Tag key={tag.label} variant={tag.variant}>{tag.label}</Tag>
                    ))}
                  </div>
                </div>

                <Button
                  variant={p.status === '모집중' ? 'primary' : 'default'}
                  style={{ marginLeft: 12, flexShrink: 0 }}
                  onClick={p.cases ? () => setDetailProject(p) : undefined}
                >
                  {p.status === '모집중' ? '지원하기' : '상세보기'}
                </Button>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '32px 0' }}>
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
