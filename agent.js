/* ═══════════════════════════════════════
   G·A·I Platform — agent.js v0.4
   AI Agent API 연동 · 대화 · 이력 저장
   ═══════════════════════════════════════ */

import { GAI, db, addDoc, collection, serverTimestamp, addScore, showToast }
  from './firebase.js';

/* ── Agent 유형 프롬프트 ── */
const AGENT_SYSTEM = {
  research: `당신은 KBU 디자인학과 G·A·I Platform의 리서치 전문 AI Agent입니다.
HCI, UX, HCAI, 디자인 방법론 관련 논문과 이론을 중심으로 답변합니다.
HCAI 원칙: 학습자의 자율성을 존중하며 최종 판단은 항상 학습자가 합니다.
답변은 한국어로, 300자 이내로 간결하게 작성하세요.`,

  feedback: `당신은 KBU 디자인학과 G·A·I Platform의 피드백 전문 AI Agent입니다.
HCI 원칙(Nielsen 10 Heuristics, Norman의 HCD)과 사용자 중심 설계 관점에서
디자인 결과물의 구체적인 개선 제안을 제공합니다.
답변은 한국어로, 300자 이내로 작성하세요.`,

  mentor: `당신은 KBU 디자인학과 G·A·I Platform의 멘토링 전문 AI Agent입니다.
디자인 산학 프로젝트의 단계별 방법론(더블 다이아몬드, 디자인 씽킹 등)과
실무 프로세스를 안내합니다.
답변은 한국어로, 300자 이내로 작성하세요.`
};

/* ── 현재 Agent 상태 ── */
const AgentState = {
  type: 'research',
  project: '스마트 라이빙 UX 리디자인',
  history: []
};

/* ── Agent 유형 선택 ── */
export function selectAgent(btn, name, desc, type) {
  document.querySelectorAll('.agent-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  AgentState.type    = type || 'research';
  AgentState.history = [];
  document.getElementById('agent-title').textContent = name + ' — 대화';
  const area = document.getElementById('chat-area');
  area.innerHTML = `
    <div class="chat-row">
      <div class="chat-avatar" style="background:var(--purple-l);color:var(--purple)">AI</div>
      <div class="agent-bubble bubble-ai">
        <strong>${name}</strong>입니다.<br>
        <span style="font-size:11px;color:var(--text3)">${desc}</span><br>
        현재 프로젝트: <strong>${AgentState.project}</strong><br>
        무엇이든 질문해주세요.
      </div>
    </div>`;
}

/* ── 프로젝트 변경 ── */
export function setProject(val) {
  AgentState.project = val;
  AgentState.history = [];
  showToast(`프로젝트 변경: ${val}`);
}

/* ── 메시지 전송 ── */
export async function sendMsg() {
  const inp = document.getElementById('chat-input');
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';

  const area = document.getElementById('chat-area');
  const roleInit = { student:'학생', professor:'교수', industry:'기업', researcher:'연구' };
  const init = roleInit[GAI.role] || '나';

  /* 사용자 메시지 렌더 */
  appendBubble(area, 'user', init, escHtml(val),
    'background:var(--bg2);color:var(--text2)');

  /* 히스토리 추가 */
  AgentState.history.push({ role: 'user', content: val });

  /* AI 응답 자리 */
  const bubble = appendBubble(area, 'ai', 'AI',
    '<span class="typing-dots"><span>·</span><span>·</span><span>·</span></span>',
    'background:var(--purple-l);color:var(--purple)');

  area.scrollTop = area.scrollHeight;

  try {
    const systemPrompt = buildSystem();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: AgentState.history.slice(-8)
      })
    });

    if (!res.ok) throw new Error('API ' + res.status);
    const data  = await res.json();
    const reply = data.content?.find(c => c.type === 'text')?.text
                  || '응답을 받지 못했습니다.';

    AgentState.history.push({ role: 'assistant', content: reply });
    bubble.innerHTML = '';
    await typeText(bubble, reply);

    /* Firestore에 대화 저장 */
    if (GAI.user) {
      await addDoc(collection(db, 'users', GAI.user.uid, 'agentSessions'), {
        agentType: AgentState.type,
        project:   AgentState.project,
        userMsg:   val,
        aiReply:   reply,
        createdAt: serverTimestamp()
      });
      await addScore(GAI.user.uid, 2, `[AI Agent] ${AgentState.type} 세션`);
    }

  } catch (e) {
    bubble.innerHTML = `
      <span style="color:var(--coral)">⚠ API 오류</span><br>
      <span style="font-family:var(--mono);font-size:10px;color:var(--text3)">${e.message}</span><br>
      <span style="font-size:11px;color:var(--text3)">Firebase Console에서 API 키를 확인하거나,<br>
      Anthropic 계정에 크레딧이 있는지 확인해주세요.</span>`;
  }
  area.scrollTop = area.scrollHeight;
}

/* ── 빠른 질문 ── */
export function setPrompt(txt) {
  document.getElementById('chat-input').value = txt;
  document.getElementById('chat-input').focus();
}

/* ── 내부 헬퍼 ── */
function buildSystem() {
  const base   = AGENT_SYSTEM[AgentState.type] || AGENT_SYSTEM.research;
  const role   = { student:'학생', professor:'교수·교육자', industry:'산업체 파트너', researcher:'외부 연구자' }[GAI.role] || '학생';
  return `${base}\n\n[컨텍스트]\n사용자 역할: ${role}\n현재 프로젝트: ${AgentState.project}\n플랫폼: G·A·I Platform (KBU 디자인학과 · (재)경기도경제과학진흥원 디자인 재능나눔 사업)`;
}

function appendBubble(area, who, init, html, avatarStyle) {
  const row = document.createElement('div');
  row.className = `chat-row ${who === 'user' ? 'user' : ''} fade-up`;
  const bubble = document.createElement('div');
  bubble.className = `agent-bubble ${who === 'user' ? 'bubble-user' : 'bubble-ai'}`;
  bubble.innerHTML = html;
  row.innerHTML = `<div class="chat-avatar" style="${avatarStyle}">${init}</div>`;
  row.appendChild(bubble);
  area.appendChild(row);
  return bubble;
}

async function typeText(el, text) {
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await new Promise(r => setTimeout(r, 16));
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
