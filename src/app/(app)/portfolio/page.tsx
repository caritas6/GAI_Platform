'use client';

import { useState } from 'react';
import { SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
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
}

const items: PortfolioItem[] = [
  {
    id: 1,
    title: '스마트홈 UX 리디자인',
    members: '김디자인 외 3인',
    company: '삼성전자',
    field: 'UX · 스마트홈',
    color: '#E1F5EE',
    textColor: '#085041',
    category: 'UX/UI',
  },
  {
    id: 2,
    title: 'AR 내비게이션 프로토타입',
    members: '박AR 외 2인',
    company: '현대자동차',
    field: 'AR · 자동차',
    color: '#EEEDFE',
    textColor: '#3C3489',
    category: '실감콘텐츠',
  },
  {
    id: 3,
    title: '지속가능 패키지 브랜딩',
    members: '이모션 외 4인',
    company: '풀무원',
    field: '영상 · 브랜딩',
    color: '#FBEAF0',
    textColor: '#4B1528',
    category: '영상',
  },
  {
    id: 4,
    title: 'XR 문화유산 체험 시스템',
    members: '최XR 외 3인',
    company: '문화재청',
    field: 'XR · 문화',
    color: '#FAEEDA',
    textColor: '#412402',
    category: '실감콘텐츠',
  },
  {
    id: 5,
    title: '공공 키오스크 접근성',
    members: '정서비스 외 3인',
    company: '서울시',
    field: '서비스 · 공공',
    color: '#FAECE7',
    textColor: '#4A1B0C',
    category: 'UX/UI',
  },
];

const categories = ['전체', 'UX/UI', '실감콘텐츠', '영상'];

export default function PortfolioPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title.includes(search) || item.company.includes(search);
    const matchCategory = category === '전체' || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* 검색 & 필터 바 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="결과물 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              border: '0.5px solid var(--color-border)',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 16px rgba(83,74,183,0.12)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            {/* 썸네일 */}
            <div
              style={{
                height: 70,
                background: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 10, color: item.textColor, fontWeight: 500 }}>
                {item.field}
              </span>
            </div>
            {/* 정보 */}
            <div style={{ padding: '8px 10px' }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 3px',
                }}
              >
                {item.title}
              </p>
              <p style={{ fontSize: 9, color: 'var(--color-text-tertiary)', margin: 0 }}>
                {item.members} · {item.company}
              </p>
            </div>
          </div>
        ))}

        {/* 추가 카드 */}
        <div
          style={{
            border: '0.5px dashed var(--color-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 110,
            cursor: 'pointer',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22,
                color: 'var(--color-text-tertiary)',
                marginBottom: 4,
                lineHeight: 1,
              }}
            >
              +
            </div>
            <p style={{ fontSize: 9, color: 'var(--color-text-tertiary)', margin: 0 }}>
              새 결과물 추가
            </p>
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button fullWidth>PDF로 내보내기</Button>
        <Button variant="primary" fullWidth>
          공개 갤러리로 공유
        </Button>
      </div>
    </div>
  );
}
