import { useEffect, useRef, useState } from 'react';
import './AiChat.css';

const QUESTIONS = [
  '예진은 어떤 개발자인가요?',
  '어떤 기술을 사용하나요?',
  '어떤 프로젝트를 만들었나요?',
  '무엇을 공부하고 있나요?',
];

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
        '안녕하세요! 예진에 대해 궁금한 내용을 선택해주세요.',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return;

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: question,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }

      const data = await response.json();

      // 로딩 종료
      setIsLoading(false);

      // AI 타이핑 효과
      await typeMessage(data.answer);

    } catch (error) {
      console.error(error);

      setIsLoading(false);

      await typeMessage(
        'AI 서버와 연결할 수 없습니다.'
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


            {/* =========================
                Quick Menu
                ========================= */}

            <div className="ai-question-list">

              <span className="ai-question-label">
                QUICK MENU
              </span>

              {QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => askQuestion(question)}
                  disabled={isLoading}
                >
                  <span>
                    {question}
                  </span>

                  <span className="question-arrow">
                    ›
                  </span>
                </button>
              ))}

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
