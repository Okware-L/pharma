import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import Content from "@/components/Content";

export default function Home() {
  return (
    <>
      <div className="w-screen min-h-screen  bg-gray-100">
        <Navbar />
        <div className="sm:px-20 px-5 ">
          <Hero />
          <Content />
        </div>
      </div>
    </>
  );
}
