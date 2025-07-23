"use client";
import { useState } from "react";
import { useAuthStore } from "@/components/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Navlogo from "@/components/navlogo";

const Page = () => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseSidebar = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setSidebarOpen(false);
      setIsClosing(false);
    }
  };

  const tools = {
    "forntend": [
      {
        "name": "Next.js",
        "description": "A React framework for building server-rendered and statically generated web applications.",
        "link": "https://nextjs.org/",
        "icon": "/next.svg"
      },
      {
        "name": "Tailwindcss",
        "description": "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
        "link": "https://tailwindcss.com/",
        "icon": "/tailwind.svg"
      },
      {
        "name": "Zustand",
        "description": "A small, fast and scalable bearbones state-management solution.",
        "link": "https://zustand-demo.pmnd.rs/",
        "icon": "/zustand.svg"
      },
      {
        "name": "React Query",
        "description": "A powerful and versatile data fetching and caching library for React.",
        "link": "https://tanstack.com/query/v4",
        "icon": "/tanstack.png"
      },
      {
        name: "Axios",
        description: "Promise based HTTP client for the browser and node.js",
        link: "https://axios-http.com",
        icon: "/axios.svg"
      }
    ],
    "backend": [
      {
        "name": "Encore.dev",
        "description": "Type-safe, scalable backend services.",
        "link": "https://encore.dev",
        "icon": "/encore.svg"
      },
      {
        "name": "Postgres",
        "description": "Reliable relational database.",
        "link": "https://www.postgresql.org/",
        "icon": "/postgres.svg"
      },
      {
        "name": "Drizzle",
        "description": "Safe, developer-friendly SQL migrations.",
        "link": "https://drizzle.org/",
        "icon": "/drizzle.svg"
      },
      {
        "name": "Cloudinary",
        "description": "A cloud-based media management platform that allows users to store, manage, and deliver images, videos, and other media assets.",
        "link": "https://cloudinary.com/",
        "icon": "/cloudinary.svg"
      },
      {
        "name": "Redis",
        "description": "In-memory data structure store, used as a database, cache, and message broker.",
        "link": "https://redis.io/",
        "icon": "/redis.svg"
      },

    ]
  }



  return (
    <div className="relative bg-[#1f2736] text-white min-h-screen overflow-x-hidden">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 lg:px-72 py-4 backdrop-blur-md bg-[#030a17] z-50 border-b border-white/10">
        <a href="#" className="text-xl font-bold cursor-pointer"><Navlogo size={100} /></a>


        {/* Desktop Links */}
        <div className="md:flex items-center gap-6 text-sm lg:text-base hidden md:pointer-events-auto">
          <a href="https://www.linkedin.com/in/pritammondal-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">About Me</a>
          <a href="#techstack" className="hover:text-white/70 transition-colors">Tech Stack</a>
          <a target="_blank" href="https://wa.me/916291258816" className="hover:text-white/70 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-2">

          <a href={user ? "/chat" : "/register"}>
            {/* <Button variant="outline" className="bg-primary cursor-pointer rounded-full">
              {user ? "Go to Chat" : "Sign Up"}
            </Button> */}
            <button className="border bg-[#353535]/30 shadow-xs  hover:text-[#fafafa] dark:bg-input/30 dark:border-[#353535] hover:bg-[#353535]/50 px-4 py-1 rounded-full cursor-pointer">
              {user ? "Go to Chat" : "Sign Up"}
            </button>
          </a>

          {/* Hamburger on Mobile */}
          <div className="md:hidden">
            <Button aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          ></div>

          {/* Sidebar Panel */}
          <div
            className={`relative bg-[#030a17] w-64 max-w-[80%] h-full p-6 flex flex-col gap-6
                ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <button
              onClick={handleCloseSidebar}
              className="self-end"
            >
              <X className="w-6 h-6" />
            </button>

            <a
              href="https://www.linkedin.com/in/pritammondal-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              About Me
            </a>
            <a
              href="#blog"
              className="hover:text-white/70 transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="https://wa.me/916291258816"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Animation */}

        </div>
      )}
      {/* Animation */}
      <style jsx global>{`
    @keyframes slide-in-right {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out forwards;
    }
`}</style>
      {/* Page Content */}
      <div className="px-6 lg:px-64 flex flex-col gap-6 justify-center items-center text-center pt-32 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:40px_40px]">
        <div className="text-3xl lg:text-6xl font-bold lg:max-w-2xl">
          “A simple, instant way to chat with anyone.”
        </div>
        <div className="flex flex-col items-center gap-4 max-w-md">
          <div className="text-gray-300">
            Enjoy realtime messaging with a clean interface you’ll love.
          </div>
          <a href={"/register"}>
            <Button className="cursor-pointer max-w-min rounded-full px-8 hover:scale-105 transition-transform bg-white hover:bg-white/90 text-[#353535]">
              Try It Now <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Floating Dashboard Image */}
        <div className="mt-4 lg:mt-12 w-full max-w-4xl px-4">
          <div className="rounded-2xl overflow-hidden hidden md:block shadow-2xl w-full h-auto">

            <Image
              src="/hero_ui.webp"
              alt="Rflect Chat UI"
              width={1200}
              height={500}
              loading="eager"
              priority={true}

              sizes="100vw"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            // className="object-cover" // or object-contain

            // height={400}
            />
          </div>
          <div className="md:hidden rounded-2xl overflow-hidden shadow-2xl h-full w-auto">
            <Image
              src="/chat_ui_mobile.webp"
              alt="Rflect Chat UI Mobile"
              width={164}    // aspect-correct width
              height={300}   // desired display height
              loading="eager"

              // fill
              style={{
                width: "100%",
                height: "100%",
              }}
              // sizes="100vw"
              priority={true}
            />
          </div>
        </div>
      </div>

      <section id="techstack" className="px-6 lg:px-64 py-16 flex flex-col items-center text-center gap-8">
        <h2 className="text-3xl lg:text-4xl font-bold">Tech Stack</h2>
        <p className="text-base text-neutral-300 max-w-prose">
          I&apos;ve chosen a modern stack focusing on performance, SEO optimization, and mobile first approach.
        </p>

        {/* Frontend part */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6 items-center ">
          {tools.forntend.map((tool, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="w-24 h-24 bg-white rounded-lg p-2">
                <Image
                  src={"/tools" + tool.icon}
                  alt={tool.name}
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <p className="text-neutral-400">
                {tool.name}
              </p>
            </div>
          ))}

          {tools.backend.map((tool, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="w-24 h-24 bg-white rounded-lg p-2">
                <Image
                  src={"/tools" + tool.icon}
                  alt={tool.name}
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <p className="text-neutral-400">
                {tool.name}
              </p>
            </div>
          ))}

        </div>

        {/* backend part */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 items-center">
                    
                </div> */}

      </section>

      <section id="special" className="px-6 lg:px-64 py-16 flex flex-col items-center text-center gap-8">
        <h2 className="text-3xl lg:text-4xl font-bold">Special Thanks to Encore.dev</h2>
        <p className="text-base text-neutral-300 max-w-4xl">
          <a href="https://encore.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Encore.dev</a> is an open-source TypeScript backend framework that helps you build robust, type-safe APIs without boilerplate and with zero npm dependencies. It allows you to focus on your product by handling API design, infrastructure, and scalability out of the box.
        </p>
        <div className="w-full  rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/encore.png"
            alt="Encore.dev Screenshot"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
            style={{
              width: "100%",
              height: "auto",
            }}
            sizes="100vw"
          />
        </div>
      </section>



    </div>
  );
};

export default Page;
