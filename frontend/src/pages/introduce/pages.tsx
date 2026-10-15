import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AiChat from '../../components/ai/AiChat';

// 상단 메뉴는 App.tsx의 Navbar가 모든 공개 페이지에 공통으로 보여준다.

function Introduce() {
  return (
    <div className="introduce">
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />

        <AiChat />
      </main>
    </div>
  );
}

export default Introduce;
