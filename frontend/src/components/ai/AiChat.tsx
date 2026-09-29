import { useEffect, useRef, useState } from 'react';
import './AiChat.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function RobotIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="robot-icon"
    >
      <path
        d="M24 6v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <circle
        cx="24"
        cy="5"
        r="2"
        fill="currentColor"
      />

      <rect
        x="8"
        y="12"
        width="32"
        height="27"
        rx="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />

      <circle
        cx="18"
        cy="25"
        r="2.5"
        fill="currentColor"
      />

      <circle
        cx="30"
        cy="25"
        r="2.5"
        fill="currentColor"
      />

      <path
        d="M18 32c3 2 9 2 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AiChat() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! 예진에 대해 궁금한 내용을 질문해주세요.\n\n'
      + '예) 기본 프로필 정보, 기술 스택, 프로젝트 정보, 공부중인 내용 등'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [input, setInput] = useState('');

  // 가장 아래 메시지로 자동 스크롤
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  // =========================
  // 타이핑 효과
  // =========================

  const typeMessage = (message: string) => {
    return new Promise<void>((resolve) => {
      let currentText = '';
      let index = 0;

      // 먼저 빈 AI 메시지 생성
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
        },
      ]);

      const interval = setInterval(() => {
        currentText += message[index];
        index += 1;

        setMessages((prev) => {
          const next = [...prev];

          next[next.length - 1] = {
            role: 'assistant',
            content: currentText,
          };

          return next;
        });

        if (index >= message.length) {
          clearInterval(interval);
          resolve();
        }
      }, 30);
    });
  };

  // =========================
  // 질문
  // =========================

  const askQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (
      !trimmedQuestion ||
      isLoading ||
      isQuotaExceeded
    ) {
      return;
    }

    setInput('');

    const updatedMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: trimmedQuestion,
      },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    // 5초 후 fetch 요청 취소
    const controller = new AbortController();
    const AI_TIMEOUT = 30000;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, AI_TIMEOUT);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmedQuestion,
            messages: updatedMessages,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // 429 = Gemini 무료 API 한도 초과
      if (response.status === 429) {

        setIsLoading(false);
        setIsQuotaExceeded(true);

        await typeMessage(
          '🤖 오늘 AI 무료 API 사용 한도를 모두 사용했어요.\n\n' +
          'Gemini API 무료 한도가 다시 충전되면 이용할 수 있습니다.'
        );

        return;
      }

      // 그 외 HTTP 오류
      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status}`
        );
      }
      const data = await response.json();

      setIsLoading(false);

      await typeMessage(data.answer);

    } catch (error) {

      clearTimeout(timeoutId);

      console.error(error);

      setIsLoading(false);

      // 5초 타임아웃
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        await typeMessage(
          '🤖 AI 응답이 너무 오래 걸리고 있어요.\n\n' +
          '잠시 후 다시 시도해주세요.'
        );

        return;
      }

      // 그 외 오류
      await typeMessage(
        '🤖 AI 서버와 연결할 수 없습니다.\n\n' +
        '잠시 후 다시 시도해주세요.'
      );
    }
  };

  return (
    <>
      {isOpen && (
        <div className="ai-chat">

          {/* =========================
              Header
              ========================= */}

          <div className="ai-chat-header">

            <div className="ai-chat-title">

              <div className="ai-chat-mini-icon">
                <RobotIcon />
              </div>

              <div>
                <strong>AI Assistant</strong>
                <span>YeJin Portfolio</span>
              </div>

            </div>

            <button
              className="ai-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="챗봇 닫기"
            >
              ×
            </button>

          </div>


          {/* =========================
              Body
              ========================= */}

          <div className="ai-chat-body">

            <div className="ai-message-list">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`ai-message ${
                    message.role === 'user'
                      ? 'user-message'
                      : 'assistant-message'
                  }`}
                >

                  {message.role === 'assistant' && (
                    <span className="message-label">
                      AI
                    </span>
                  )}

                  <p>
                    {message.content}
                  </p>

                </div>
              ))}


              {/* AI 생각 중 */}

              {isLoading && (
                <div className="ai-message assistant-message">

                  <span className="message-label">
                    AI
                  </span>

                  <p className="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </p>

                </div>
              )}


              {/* 자동 스크롤 위치 */}

              <div ref={messagesEndRef} />

            </div>


            <div className="ai-input-area">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      askQuestion(input);
                    }
                  }}
                  placeholder={
                    isQuotaExceeded
                      ? '오늘은 AI를 사용할 수 없어요'
                      : isLoading
                        ? '답변을 기다리는 중...'
                        : '메시지를 입력하세요...'
                  }
                  disabled={isLoading || isQuotaExceeded}
                />

                <button
                  type="button"
                  onClick={() => askQuestion(input)}
                  disabled={
                    isLoading ||
                    isQuotaExceeded ||
                    !input.trim()
                  }
                >
                  {isLoading ? '...' : '↑'}
                </button>
            </div>

          </div>
        </div>
      )}


      {/* =========================
          Floating Button
          ========================= */}

      <button
        className={`ai-chat-button ${
          isOpen ? 'is-open' : ''
        }`}
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        aria-label="AI 챗봇 열기"
      >
        <RobotIcon />
      </button>
    </>
  );
}

export default AiChat;
