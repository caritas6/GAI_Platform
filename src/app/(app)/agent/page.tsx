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
      id: 1,
      role: 'ai',
      text: '스마트홈 UX 관련 최신 리서치 논문을 3편 정리했습니다. 어떤 측면을 더 깊이 볼까요?',
    },
  ],
  '피드백 Agent': [
    {
      id: 1,
      role: 'ai',
      text: '안녕하세요! 결과물을 공유해주시면 UX 관점에서 상세한 피드백을 드리겠습니다.',
    },
  ],
  '멘토링 Agent': [
    {
      id: 1,
      role: 'ai',
      text: '프로젝트의 현재 단계를 알려주시면 다음 단계 가이드를 제공해 드릴게요.',
    },
  ],
};

const quickPrompts = ['관련 논문 찾기', '결과물 피드백', '다음 단계 안내'];

export default function AgentPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('리서치 Agent');
  const [selectedProject, setSelectedProject] = useState('스마트홈 UX 리디자인');
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

    const aiResponses: Record<string, string> = {
      '관련 논문 찾기':
        '노인 UX 관련 논문 5편을 추가로 찾았습니다. ISO 9241-171 접근성 가이드라인과 연계해서 정리할까요?',
      '결과물 피드백':
        '사용자 흐름 3단계에서 인지 부하가 높습니다. 정보 그룹핑을 재검토해보세요.',
      '다음 단계 안내':
        '현재 리서치 단계가 완료되면 사용자 인터뷰 설계로 넘어가는 것을 추천드립니다.',
    };

    const aiText =
      aiResponses[msg] ||
      `"${msg}"에 대한 분석을 시작합니다. 잠시 후 결과를 공유해 드릴게요.`;

    const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: aiText };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
      {/* 사이드바: Agent 유형 */}
      <div>
        <SectionLabel>Agent 유형</SectionLabel>
        {(Object.keys(agentDescriptions) as AgentType[]).map((agent) => (
          <Card
            key={agent}
            onClick={() => handleAgentChange(agent)}
            style={{
              marginBottom: 6,
              cursor: 'pointer',
              borderColor: selectedAgent === agent ? 'var(--brand-border)' : 'var(--color-border)',
              borderWidth: selectedAgent === agent ? 1 : 0.5,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: selectedAgent === agent ? 'var(--brand-text)' : 'var(--color-text-primary)',
                margin: '0 0 2px',
              }}
            >
              {agent}
            </p>
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', margin: 0 }}>
              {agentDescriptions[agent]}
            </p>
          </Card>
        ))}

        <div
          style={{
            marginTop: 12,
            borderTop: '0.5px solid var(--color-border)',
            paddingTop: 10,
          }}
        >
          <SectionLabel>현재 프로젝트</SectionLabel>
          <select style={{ width: '100%', fontSize: 11 }} value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option>스마트홈 UX 리디자인</option>
            <option>AR 내비게이션</option>
          </select>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>
          {selectedAgent} — {selectedProject}
        </SectionLabel>

        {/* 메시지 목록 */}
        <div
          style={{
            flex: 1,
            padding: 12,
            background: 'var(--color-bg-secondary)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 10,
            minHeight: 220,
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: 6,
                marginBottom: 10,
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {m.role === 'ai' && (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--brand-light)',
                    color: 'var(--brand-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  AI
                </div>
              )}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  lineHeight: 1.6,
                  maxWidth: '82%',
                  background:
                    m.role === 'user' ? 'var(--brand-light)' : 'var(--color-bg-primary)',
                  color:
                    m.role === 'user' ? 'var(--brand-text)' : 'var(--color-text-primary)',
                  border:
                    m.role === 'ai' ? '0.5px solid var(--color-border)' : 'none',
                }}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--brand-light)',
                    color: 'var(--brand-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
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
            placeholder="Agent에게 질문하기..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1 }}
          />
          <Button variant="primary" onClick={() => sendMessage()}>
            전송
          </Button>
        </div>

        {/* 빠른 질문 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickPrompts.map((p) => (
            <Tag key={p} variant="purple" onClick={() => sendMessage(p)} style={{ cursor: 'pointer' }}>
              {p}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
