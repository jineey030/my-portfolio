import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AiChat from '../../components/ai/AiChat';
import './introduce.css';

function Introduce() {
  return (
    <div className="introduce">
      <Header />

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
