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

const agentColors: Record<AgentType, string> = {
  '리서치 Agent': '#3B82F6',
  '피드백 Agent': '#8B5CF6',
  '멘토링 Agent': '#10B981',
};

const initialMessage: Record<AgentType, string> = {
  '리서치 Agent': '안녕하세요! 리서치 Agent입니다. 프로젝트 관련 자료 수집, 논문 분석, 사례 조사를 도와드립니다. 어떤 주제를 조사할까요?',
  '피드백 Agent': '안녕하세요! 피드백 Agent입니다. 결과물(디자인, 기획서, 보고서 등)을 설명해주시면 UX·디자인 관점에서 개선 방향을 제안드릴게요.',
  '멘토링 Agent': '안녕하세요! 멘토링 Agent입니다. 현재 프로젝트의 진행 단계를 알려주시면 다음 단계 가이드와 체크리스트를 제공해드릴게요.',
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
  '리서치 Agent': ['관련 국내외 사례 찾기', 'HCI 논문 조사', '경쟁사 분석', '트렌드 리포트 요약'],
  '피드백 Agent': ['디자인 개선점 제안', '사용성 평가 기준', '브랜딩 일관성 체크', '컬러/타이포 검토'],
  '멘토링 Agent': ['다음 단계 체크리스트', '프로젝트 일정 조언', '팀 역할 분배 가이드', '최종 발표 준비'],
};

export default function AgentPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('리서치 Agent');
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: initialMessage['리서치 Agent'] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgentChange = (agent: AgentType) => {
    setSelectedAgent(agent);
    setMessages([{ id: Date.now(), role: 'ai', text: initialMessage[agent] }]);
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // 로딩 버블 추가
    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, role: 'ai', text: '...' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          agentType: selectedAgent,
          projectName: selectedProject,
        }),
      });

      const data = await res.json();

      // 로딩 버블 → 실제 응답으로 교체
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, text: data.error ? `오류: ${data.error}` : data.text }
            : m,
        ),
      );
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, text: '연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12 }}>
      {/* 사이드바 */}
      <div>
        <SectionLabel>Agent 유형</SectionLabel>
        {(Object.keys(agentDescriptions) as AgentType[]).map((agent) => (
          <Card
            key={agent}
            onClick={() => handleAgentChange(agent)}
            style={{
              marginBottom: 6, cursor: 'pointer',
              borderColor: selectedAgent === agent ? agentColors[agent] : 'var(--color-border)',
              borderWidth: selectedAgent === agent ? 1.5 : 0.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: agentColors[agent], flexShrink: 0,
              }} />
              <p style={{
                fontSize: 12, fontWeight: 600, margin: 0,
                color: selectedAgent === agent ? agentColors[agent] : 'var(--color-text-primary)',
              }}>
                {agent}
              </p>
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 12 }}>
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
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SectionLabel style={{ margin: 0 }}>
            <span style={{ color: agentColors[selectedAgent] }}>{selectedAgent}</span>
            <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, fontSize: 10 }}>
              {' '}— {selectedProject}
            </span>
          </SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: loading ? '#F59E0B' : '#10B981',
              transition: 'background 0.3s',
            }} />
            <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)' }}>
              {loading ? '응답 중...' : '대기 중'}
            </span>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div style={{
          padding: 12,
          background: 'var(--color-bg-secondary)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 10,
          minHeight: 260, maxHeight: 380,
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
                  background: agentColors[selectedAgent] + '22',
                  color: agentColors[selectedAgent],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, flexShrink: 0,
                }}>
                  AI
                </div>
              )}
              <div style={{
                padding: '8px 10px', borderRadius: 8,
                fontSize: 11, lineHeight: 1.65, maxWidth: '82%',
                whiteSpace: 'pre-line',
                background: m.role === 'user'
                  ? agentColors[selectedAgent] + '22'
                  : 'var(--color-bg-primary)',
                color: m.role === 'user'
                  ? agentColors[selectedAgent]
                  : m.text === '...' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                border: m.role === 'ai' ? '0.5px solid var(--color-border)' : 'none',
                fontStyle: m.text === '...' ? 'italic' : 'normal',
              }}>
                {m.text === '...' ? (
                  <span style={{ letterSpacing: 3 }}>···</span>
                ) : m.text}
              </div>
              {m.role === 'user' && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--brand-light)', color: 'var(--brand-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, flexShrink: 0,
                }}>
                  나
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder={`${selectedAgent}에게 질문하기...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
            style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
          />
          <Button
            variant="primary"
            onClick={() => sendMessage()}
            style={{
              background: loading ? 'var(--brand-border)' : agentColors[selectedAgent],
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : '전송'}
          </Button>
        </div>

        {/* 빠른 질문 */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
            빠른 질문
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {quickPrompts[selectedAgent].map((p) => (
              <Tag
                key={p}
                variant="purple"
                onClick={() => !loading && sendMessage(p)}
                style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
              >
                {p}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
