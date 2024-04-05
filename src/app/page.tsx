import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="w-screen min-h-screen  bg-gradient-to-r from-sky-300 to-sky-100">
        <Navbar />
        <div className="sm:px-40 px-5 mt-10">
          <Hero />
        </div>
      </div>
    </>
  );
}
