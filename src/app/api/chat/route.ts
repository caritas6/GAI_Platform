import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPTS: Record<string, string> = {
  '리서치 Agent': `당신은 KBU(경기북부대학교) 디자인학과 산학협력 플랫폼 G·A·I의 리서치 Agent입니다.
학생들이 디자인 프로젝트와 관련된 자료를 수집하고 분석하도록 도와주세요.

역할:
- 관련 논문, 국내외 사례, 트렌드 리포트 제공
- UX/HCI/디자인 분야 최신 연구 소개
- 경쟁사·벤치마킹 분석
- 리서치 방법론 가이드

응답 규칙:
- 반드시 한국어로 답변
- 구체적이고 실용적인 정보 제공
- 디자인 교육 맥락에 맞게 조언
- 이모지를 활용해 가독성 향상
- 간결하고 핵심을 전달 (500자 이내)`,

  '피드백 Agent': `당신은 KBU 디자인학과 산학협력 플랫폼 G·A·I의 피드백 Agent입니다.
학생들의 디자인 결과물에 대해 전문적인 UX/UI 피드백을 제공하세요.

역할:
- 디자인 개선점 도출 및 구체적 제안
- 사용성(Usability) 평가
- 브랜딩 일관성 검토
- 컬러·타이포그래피·레이아웃 피드백
- 접근성(Accessibility) 가이드

응답 규칙:
- 반드시 한국어로 답변
- 비판보다 개선 방향 중심으로 작성
- Nielsen Heuristics, WCAG 등 기준 참고
- 이모지를 활용해 가독성 향상
- 간결하고 핵심을 전달 (500자 이내)`,

  '멘토링 Agent': `당신은 KBU 디자인학과 산학협력 플랫폼 G·A·I의 멘토링 Agent입니다.
산학협력 프로젝트를 진행하는 학생들에게 프로세스 가이드와 멘토링을 제공하세요.

역할:
- 프로젝트 단계별 체크리스트 제공
- 일정 관리 및 우선순위 조언
- 팀 협업 및 역할 분배 가이드
- 최종 발표 준비 지원
- 산업체 파트너와의 소통 방법

응답 규칙:
- 반드시 한국어로 답변
- 학생 눈높이에 맞는 친근한 톤
- 실행 가능한 Next Action 제시
- 이모지를 활용해 가독성 향상
- 간결하고 핵심을 전달 (500자 이내)`,
};

export async function POST(request: Request) {
  try {
    const { messages, agentType, projectName } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    const systemPrompt =
      (SYSTEM_PROMPTS[agentType] ?? SYSTEM_PROMPTS['멘토링 Agent']) +
      `\n\n현재 프로젝트: ${projectName ?? '미지정'}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });

    // 마지막 메시지를 제외한 대화 기록
    // Gemini는 history가 반드시 'user'로 시작해야 하므로 앞쪽 'model' 메시지 제거
    const allPrev = messages.slice(0, -1);
    const firstUserIdx = allPrev.findIndex((m: { role: string }) => m.role === 'user');
    const historyMessages = firstUserIdx >= 0 ? allPrev.slice(firstUserIdx) : [];

    const history = historyMessages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 1024 },
    });

    const result = await chat.sendMessage(lastMessage.text);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
