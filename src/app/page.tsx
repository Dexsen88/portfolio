import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Cursor from "@/components/motion/Cursor";
import MotionProvider from "@/components/motion/MotionProvider";
import PointerLight from "@/components/motion/PointerLight";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SmoothScroll from "@/components/motion/SmoothScroll";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

export default function Home() {
  return (
    <MotionProvider>
      <SmoothScroll />
      <ScrollProgress />
      <PointerLight />
      <Cursor />
      <Nav />

      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </MotionProvider>
  );
}
