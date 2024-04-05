import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="w-screen min-h-screen  bg-gray-100">
        <Navbar />
        <div className="sm:px-20 px-5 ">
          <Hero />
        </div>
      </div>
    </>
  );
}
