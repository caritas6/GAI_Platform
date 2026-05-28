'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/Card';
import Button from '@/components/Button';

interface PortfolioItem {
  id: number;
  title: string;
  members: string;
  company: string;
  field: string;
  color: string;
  textColor: string;
  category: string;
  caseLabel?: string;
}

const items: PortfolioItem[] = [
  {
    id: 1,
    title: '앨범 자켓 콜라보레이션',
    members: '시각디자인학과 X 실용음악과',
    company: 'KBU 다학제적 융합 프로젝트',
    field: '브랜딩 · 콜라보레이션',
    color: '#EEEDFE',
    textColor: '#3C3489',
    category: '산학협력',
    caseLabel: 'PROJECT 01',
  },
  {
    id: 2,
    title: '지역 기업 브랜딩 — 크로바 · 위드쿡',
    members: 'KBU 디자인학과',
    company: '지역 기업&대학 연계 브랜딩 사업',
    field: '브랜딩 · 캡스톤',
    color: '#E1F5EE',
    textColor: '#085041',
    category: '산학협력',
    caseLabel: 'PROJECT 02',
  },
  {
    id: 3,
    title: '디자인재능나눔 — 브랜딩 & 패키지',
    members: 'KBU X 경기도경제과학진흥원',
    company: '중소기업 10개사 참여',
    field: '브랜딩 · 패키지 · 캐릭터',
    color: '#FAEEDA',
    textColor: '#412402',
    category: '산학협력',
    caseLabel: 'PROJECT 03',
  },
  {
    id: 4,
    title: '다문화 청소년 미디어리터러시 프로그램',
    members: '경북대학교 X 한국언론진흥재단',
    company: '남양주시 다문화가족지원센터',
    field: 'XR · 미디어교육',
    color: '#FBEAF0',
    textColor: '#4B1528',
    category: '산학협력',
    caseLabel: 'PROJECT 04',
  },
  {
    id: 5,
    title: '미디어콘텐츠 제작센터 구축',
    members: '경북대학교 영상미디어콘텐츠학과',
    company: '학교기업 — 미디어콘텐츠 제작센터',
    field: '영상 · 실감콘텐츠',
    color: '#E3F2FD',
    textColor: '#0D47A1',
    category: '학교기업',
  },
  {
    id: 6,
    title: '스마트홈 UX 리디자인',
    members: '김디자인 외 3인',
    company: '삼성전자',
    field: 'UX · 스마트홈',
    color: '#F3F0FF',
    textColor: '#3C3489',
    category: 'UX/UI',
  },
  {
    id: 7,
    title: 'AR 내비게이션 프로토타입',
    members: '박AR 외 2인',
    company: '현대자동차',
    field: 'AR · 자동차',
    color: '#E8F5E9',
    textColor: '#1B5E20',
    category: '실감콘텐츠',
  },
  {
    id: 8,
    title: 'XR 문화유산 체험 시스템',
    members: '최XR 외 3인',
    company: '문화재청',
    field: 'XR · 문화',
    color: '#FFF3E0',
    textColor: '#E65100',
    category: '실감콘텐츠',
  },
];

const categories = ['전체', '산학협력', '학교기업', 'UX/UI', '실감콘텐츠', '영상'];

export default function PortfolioPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filtered = items.filter((item) => {
    const matchSearch = item.title.includes(search) || item.company.includes(search);
    const matchCategory = category === '전체' || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* 상세 모달 */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 720,
              background: 'var(--color-bg-primary)',
              borderRadius: '16px 16px 0 0',
              padding: '24px 20px 32px',
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border)', margin: '0 auto 20px' }} />

            {/* 썸네일 */}
            <div style={{
              height: 120, borderRadius: 10, marginBottom: 16,
              background: selected.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                {selected.caseLabel && (
                  <div style={{ fontSize: 10, color: selected.textColor, fontFamily: 'monospace', marginBottom: 4, opacity: 0.7 }}>
                    {selected.caseLabel}
                  </div>
                )}
                <div style={{ fontSize: 14, color: selected.textColor, fontWeight: 600 }}>
                  {selected.field}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              {selected.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              {selected.company}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 16 }}>
              {selected.members}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button fullWidth onClick={() => setSelected(null)}>닫기</Button>
              <Button variant="primary" fullWidth>자세히 보기</Button>
            </div>
          </div>
        </div>
      )}

      {/* 검색 & 필터 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="결과물 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Button variant="primary">+ 내 작업 추가</Button>
      </div>

      <SectionLabel>
        전체 결과물{' '}
        <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
          ({filtered.length}건)
        </span>
      </SectionLabel>

      {/* 포트폴리오 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              border: '0.5px solid var(--color-border)',
              borderRadius: 8, overflow: 'hidden',
              cursor: 'pointer', transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(83,74,183,0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            {/* 썸네일 */}
            <div style={{
              height: 70, background: item.color,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 2,
            }}>
              {item.caseLabel && (
                <span style={{ fontSize: 8, color: item.textColor, fontFamily: 'monospace', opacity: 0.7 }}>
                  {item.caseLabel}
                </span>
              )}
              <span style={{ fontSize: 10, color: item.textColor, fontWeight: 500 }}>
                {item.field}
              </span>
            </div>
            {/* 정보 */}
            <div style={{ padding: '8px 10px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 3px' }}>
                {item.title}
              </p>
              <p style={{ fontSize: 9, color: 'var(--color-text-tertiary)', margin: 0 }}>
                {item.members}
              </p>
            </div>
          </div>
        ))}

        {/* 추가 카드 */}
        <div style={{
          border: '0.5px dashed var(--color-border)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 110, cursor: 'pointer',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, color: 'var(--color-text-tertiary)', marginBottom: 4, lineHeight: 1 }}>+</div>
            <p style={{ fontSize: 9, color: 'var(--color-text-tertiary)', margin: 0 }}>새 결과물 추가</p>
          </div>
        </div>
      </div>

      {/* 하단 액션 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button fullWidth>PDF로 내보내기</Button>
        <Button variant="primary" fullWidth>공개 갤러리로 공유</Button>
      </div>
    </div>
  );
}
