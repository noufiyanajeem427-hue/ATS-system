import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Hero from "./components/Hero/Hero";
import TrustedCompanies from "./components/TrustedCompanies/TrustedCompanies";
import About from "./components/About/About";
import WhyChoose from "./components/WhyChoose/WhyChoose";
import Jobs from "./components/Jobs/Jobs";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import "./Home.css";

function Home() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      <Header
        toggleSidebar={() => setIsOpen(true)}
      />

      <Sidebar
        isOpen={isOpen}
        closeSidebar={() => setIsOpen(false)}
      />
      <Hero />
      <TrustedCompanies />
      <About />
      <WhyChoose />
      <Jobs />
      <HowItWorks />
      <Contact />
      <Footer />

    </>
  );
}

export default Home;