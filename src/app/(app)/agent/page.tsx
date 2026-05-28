'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, SectionLabel } from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';

type AgentType = '리서치 Agent' | '피드백 Agent' | '멘토링 Agent';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const agentDescriptions: Record<AgentType, string> = {
  '리서치 Agent': '자료 수집 · 분석 보조',
  '피드백 Agent': '결과물 리뷰 · 개선 제안',
  '멘토링 Agent': '프로세스 가이드',
};

const initialMessages: Record<AgentType, Message[]> = {
  '리서치 Agent': [
    {
      id: 1, role: 'ai',
      text: '안녕하세요! 리서치 Agent입니다. 프로젝트 관련 자료 수집, 논문 분석, 사례 조사를 도와드립니다. 어떤 주제를 조사할까요?',
    },
  ],
  '피드백 Agent': [
    {
      id: 1, role: 'ai',
      text: '안녕하세요! 피드백 Agent입니다. 결과물(디자인, 기획서, 보고서 등)을 설명해주시면 UX·디자인 관점에서 개선 방향을 제안드릴게요.',
    },
  ],
  '멘토링 Agent': [
    {
      id: 1, role: 'ai',
      text: '안녕하세요! 멘토링 Agent입니다. 현재 프로젝트의 진행 단계를 알려주시면 다음 단계 가이드와 체크리스트를 제공해드릴게요.',
    },
  ],
};

const projects = [
  '대학·지역사회 연계 디자인 프로젝트 사업',
  '앨범 자켓 콜라보레이션',
  '지역 기업&대학 연계 브랜딩 사업',
  '디자인재능나눔사업',
  '대학·지역사회 연계 미디어리터러시 프로그램',
  '학교기업 — 미디어콘텐츠 제작센터',
  '스마트홈 UX 리디자인',
  'AR 내비게이션 콘셉트',
];

const quickPrompts: Record<AgentType, string[]> = {
  '리서치 Agent': [
    '관련 국내외 사례 찾기',
    'HCI 논문 조사',
    '경쟁사 분석',
    '트렌드 리포트 요약',
  ],
  '피드백 Agent': [
    '디자인 개선점 제안',
    '사용성 평가 기준',
    '브랜딩 일관성 체크',
    '컬러/타이포 검토',
  ],
  '멘토링 Agent': [
    '다음 단계 체크리스트',
    '프로젝트 일정 조언',
    '팀 역할 분배 가이드',
    '최종 발표 준비',
  ],
};

const aiResponses: Record<string, string> = {
  // 리서치
  '관련 국내외 사례 찾기': '선택한 프로젝트와 유사한 국내외 사례를 조사했습니다.\n\n🇰🇷 국내: 서울시 공공디자인 혁신 사례, KCDF 공예 브랜딩 프로젝트\n🌐 해외: IDEO 지역사회 디자인 프로그램, Design Council UK 산학연계 모델\n\n더 깊이 분석할 사례가 있으면 알려주세요.',
  'HCI 논문 조사': 'HCI 2024·2025 주요 논문을 정리했습니다.\n\n📄 「Participatory Design in Education-Industry Collaboration」 (CHI 2024)\n📄 「AI-Mediated Feedback in Design Education」 (DIS 2024)\n📄 「Community-Centered UX: Case Studies from Korea」 (KCHI 2025)\n\n특정 주제로 좁혀드릴까요?',
  '경쟁사 분석': '유사 플랫폼 분석 결과입니다.\n\n1️⃣ 교내 포털 — 정보 분산, UI 복잡\n2️⃣ 링크드인 러닝 — 콘텐츠 강점, 산학 연계 부재\n3️⃣ 비핸스 — 포트폴리오 특화, 교육 기능 없음\n\nG·A·I 플랫폼의 차별점: 산학협력 + AI Agent + DAO 통합',
  '트렌드 리포트 요약': '2025 디자인·AI·산학협력 주요 트렌드:\n\n🔥 생성형 AI 활용 디자인 프로세스 통합\n📐 서비스 디자인 + 지역사회 문제 해결\n🤝 MOU 기반 장기 기업-대학 파트너십 확대\n🎓 마이크로크레덴셜 기반 역량 인증 시스템\n\n자세한 분석이 필요한 트렌드가 있으신가요?',
  // 피드백
  '디자인 개선점 제안': '결과물을 구체적으로 설명해주시면 더 정확한 피드백을 드릴 수 있어요!\n\n일반적인 체크 포인트:\n✅ 정보 위계 (Hierarchy) — 핵심 내용이 시각적으로 강조되고 있나요?\n✅ 여백 (Whitespace) — 콘텐츠 밀도가 적절한가요?\n✅ 색상 대비 — 접근성(WCAG 4.5:1) 기준 충족 여부\n✅ 일관성 — 폰트·컬러·간격 시스템이 통일되어 있나요?',
  '사용성 평가 기준': 'UX 평가 시 주요 기준 (Nielsen Heuristics 기반):\n\n1. 가시성 — 현재 상태가 명확히 표시되는가\n2. 실제 사용 언어 — 전문용어 대신 사용자 언어 사용\n3. 오류 방지 — 실수를 줄이는 인터페이스 설계\n4. 유연성 — 숙련자·초보자 모두 편리하게 사용 가능\n5. 미적 일관성 — 불필요한 정보 제거\n\n어떤 항목을 우선 개선할까요?',
  '브랜딩 일관성 체크': '브랜딩 일관성 체크리스트:\n\n🎨 컬러 시스템: 주색상·보조색상·배경색 정의 여부\n✍️ 타이포그래피: 제목/본문/캡션 폰트 위계 통일\n📐 그리드 시스템: 여백·마진 규칙 일관성\n🖼 이미지 스타일: 사진·일러스트 톤 통일\n📝 보이스 & 톤: 문구 작성 스타일 가이드 유무\n\n현재 브랜딩 가이드라인이 있으신가요?',
  '컬러/타이포 검토': '컬러·타이포그래피 검토 포인트:\n\n🎨 컬러\n• 주색(Primary) — 브랜드 정체성 반영 여부\n• 대비율 — 텍스트 가독성 확보 (배경 대비 4.5:1 이상)\n• 색각 이상 고려 — Colorblind Safe 팔레트 검토\n\n✍️ 타이포\n• 본문 최소 13px 이상 권장\n• 행간(Line-height) 1.5~1.7 적정\n• 한 화면 내 폰트 패밀리 2종 이내 권장',
  // 멘토링
  '다음 단계 체크리스트': '현재 단계별 체크리스트를 제공합니다!\n\n📋 리서치 완료 후 →\n☐ 인사이트 도출 및 정리\n☐ 사용자 페르소나 작성\n☐ 문제 정의(HMW 질문)\n\n📋 디자인 시작 시 →\n☐ 와이어프레임 초안\n☐ 팀 내부 피드백 1회\n☐ 멘토/교수 중간 리뷰\n\n어느 단계에 계신가요?',
  '프로젝트 일정 조언': '산학협력 프로젝트 권장 일정 (1학기 기준):\n\n📅 Week 1-2: 킥오프 · 리서치\n📅 Week 3-4: 사용자 조사 · 인사이트\n📅 Week 5-6: 컨셉 개발 · 프로토타입\n📅 Week 7-8: 중간 발표 · 피드백 반영\n📅 Week 9-12: 디자인 완성 · 검증\n📅 Week 13-14: 최종 발표 준비\n📅 Week 15: 최종 발표 · 산업체 평가\n\n현재 몇 주차에 계신가요?',
  '팀 역할 분배 가이드': '디자인 프로젝트 팀 역할 가이드:\n\n👤 PM (프로젝트 매니저): 일정관리, 커뮤니케이션\n🎨 UX 디자이너: 리서치, 사용자 흐름 설계\n🖥 UI 디자이너: 비주얼 디자인, 프로토타이핑\n📊 리서처: 자료조사, 사용자 인터뷰\n\n팀 구성원이 몇 명인가요? 맞춤 역할 분배를 제안해드릴게요.',
  '최종 발표 준비': '최종 발표 준비 체크리스트:\n\n📊 발표 구성 (권장 10-15분)\n1. 문제 정의 (2분)\n2. 리서치 인사이트 (3분)\n3. 디자인 솔루션 시연 (5분)\n4. 기대효과·다음 단계 (3분)\n5. Q&A\n\n✅ 산업체 파트너 관점에서 강조할 점:\n• 실현 가능성 (Feasibility)\n• 비즈니스 임팩트\n• 확장 가능성\n\n발표 자료 피드백이 필요하면 공유해주세요!',
};

export default function AgentPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('리서치 Agent');
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages['리서치 Agent']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgentChange = (agent: AgentType) => {
    setSelectedAgent(agent);
    setMessages(initialMessages[agent]);
  };

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: msg };

    const aiText =
      aiResponses[msg] ||
      `[${selectedAgent}] "${msg}"에 대해 「${selectedProject}」 맥락으로 분석 중입니다.\n\n관련 자료를 정리하면:\n• 프로젝트 목표와의 연관성을 검토해볼게요\n• 구체적인 질문이나 결과물을 공유해주시면 더 정확한 도움을 드릴 수 있어요`;

    const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: aiText };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12 }}>
      {/* 사이드바: Agent 유형 */}
      <div>
        <SectionLabel>Agent 유형</SectionLabel>
        {(Object.keys(agentDescriptions) as AgentType[]).map((agent) => (
          <Card
            key={agent}
            onClick={() => handleAgentChange(agent)}
            style={{
              marginBottom: 6, cursor: 'pointer',
              borderColor: selectedAgent === agent ? 'var(--brand-border)' : 'var(--color-border)',
              borderWidth: selectedAgent === agent ? 1 : 0.5,
            }}
          >
            <p style={{
              fontSize: 12, fontWeight: 600, margin: '0 0 2px',
              color: selectedAgent === agent ? 'var(--brand-text)' : 'var(--color-text-primary)',
            }}>
              {agent}
            </p>
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0 }}>
              {agentDescriptions[agent]}
            </p>
          </Card>
        ))}

        <div style={{ marginTop: 12, borderTop: '0.5px solid var(--color-border)', paddingTop: 10 }}>
          <SectionLabel>현재 프로젝트</SectionLabel>
          <select
            style={{ width: '100%', fontSize: 11 }}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>
          {selectedAgent}
          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, fontSize: 10 }}>
            {' '}— {selectedProject}
          </span>
        </SectionLabel>

        {/* 메시지 목록 */}
        <div style={{
          padding: 12,
          background: 'var(--color-bg-secondary)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 10,
          minHeight: 220, maxHeight: 340,
          overflowY: 'auto',
        }}>
          {messages.map((m) => (
            <div key={m.id} style={{
              display: 'flex', gap: 6, marginBottom: 10,
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {m.role === 'ai' && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--brand-light)', color: 'var(--brand-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 600, flexShrink: 0,
                }}>
                  AI
                </div>
              )}
              <div style={{
                padding: '8px 10px', borderRadius: 8,
                fontSize: 11, lineHeight: 1.65, maxWidth: '82%',
                whiteSpace: 'pre-line',
                background: m.role === 'user' ? 'var(--brand-light)' : 'var(--color-bg-primary)',
                color: m.role === 'user' ? 'var(--brand-text)' : 'var(--color-text-primary)',
                border: m.role === 'ai' ? '0.5px solid var(--color-border)' : 'none',
              }}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--brand-light)', color: 'var(--brand-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 600, flexShrink: 0,
                }}>
                  나
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 입력 */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder={`${selectedAgent}에게 질문하기...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1 }}
          />
          <Button variant="primary" onClick={() => sendMessage()}>전송</Button>
        </div>

        {/* 빠른 질문 — Agent별 다른 프롬프트 */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
            빠른 질문
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {quickPrompts[selectedAgent].map((p) => (
              <Tag key={p} variant="purple" onClick={() => sendMessage(p)} style={{ cursor: 'pointer' }}>
                {p}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
