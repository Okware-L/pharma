import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import Content from "@/components/Content";
import Insights from "@/components/Insights";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="w-screen min-h-screen  bg-gray-100">
        <Navbar />
        <div className="sm:mx-20 px-5 ">
          <Hero />
          <Content />
          <Insights />
          <Footer />
        </div>
      </div>
    </>
  );
}
