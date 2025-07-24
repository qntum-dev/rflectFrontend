"use client";
import { useState } from "react";
import { useAuthStore } from "@/components/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react";
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
  const friends = [
    {
      name: "Priyangsu Banik",
      image: "https://res.cloudinary.com/qntum/image/upload/v1753288766/profile_images/profile_images/36512c88-a85b-4f38-b3fe-ec1ce54ffb55-LMixPV.jpg",
      link: "https://priyangsubanik.in/",
    },
    {
      name: "Sayandeep Dhani",
      image: "https://res.cloudinary.com/qntum/image/upload/v1753294429/profile_images/profile_images/be3fdcf6-45ed-496b-8dad-86e7a1544ea6-ohnUPm.jpg",
      link: "https://www.linkedin.com/in/sayandeep-dhani-70a04a273/",
    },
    {
      name: "Rahul Krishnan",
      image: "https://res.cloudinary.com/qntum/image/upload/v1753291822/profile_images/profile_images/8bebdd20-f602-4c96-b350-301284a76716-626nXf.jpg",
      link: "https://www.linkedin.com/in/rahul-krishnan-dev/",
    },
    {
      name: "Shriyans Mukherjee",
      image: "https://res.cloudinary.com/qntum/image/upload/v1753333633/profile_images/profile_images/77641655-d8ab-4611-93ac-f07c1a49cc94-lk68zn.jpg",
      link: "https://portfolio-six-mocha-83.vercel.app/",
    },
    // add more as needed
  ];
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
      <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 lg:px-72 py-4 backdrop-blur-md bg-[#030a17] z-50 border-b border-white/10 h-16">
        <a href="#" className="text-xl font-bold cursor-pointer flex items-center">
          <Navlogo size={100} />
        </a>

        {/* Desktop Links */}
        <div className="md:flex items-center gap-6 text-sm lg:text-base hidden md:pointer-events-auto">
          <a href="https://www.linkedin.com/in/pritammondal-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">About Me</a>
          <a href="#techstack" className="hover:text-white/70 transition-colors">Tech Stack</a>
          <a href="https://github.com/qntum-dev/rflect" className="hover:text-white/70 transition-colors" target="_blank">Code Repo</a>
          <a target="_blank" href="https://wa.me/916291258816" className="hover:text-white/70 transition-colors">Contact Me</a>
        </div>

        <div className="flex items-center gap-2">
          <a href={user ? "/chat" : "/register"}>
            <button className="border bg-[#353535]/30 shadow-xs hover:text-[#fafafa] dark:bg-input/30 dark:border-[#353535] hover:bg-[#353535]/50 px-4 py-1 rounded-full cursor-pointer whitespace-nowrap">
              {user ? "Go to Chat" : "Sign Up"}
            </button>
          </a>

          {/* Hamburger on Mobile */}
          <div className="md:hidden">
            <Button aria-label="Open sidebar" onClick={() => setSidebarOpen(true)} className="w-10 h-10 p-2">
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
              className="shover:text-white/70 transition-colors"
            >
              About Me
            </a>
            <a
              href="#blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="https://github.com/qntum-dev/rflect"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Code Repo
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
              src="https://res.cloudinary.com/qntum/image/upload/v1753373774/Screenshot_2025-07-24_214520_ybdh27.png"
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
              src={"https://res.cloudinary.com/qntum/image/upload/v1753363831/WhatsApp_Image_2025-07-24_at_4.51.29_PM_bvcruo.jpg"}
              alt="Rflect Chat UI Mobile"
              width={164}    // aspect-correct width
              height={300}   // desired display height

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

        {/* Frontend and Backend tools combined */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6 items-center">
          {tools.forntend.map((tool, index) => (
            <div key={`frontend-${index}`} className="flex flex-col items-center gap-2 transition-transform transform hover:scale-105 duration-200">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center"
              >
                <Image
                  src={"/tools" + tool.icon}
                  alt={tool.name}
                  width={80}
                  height={80}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </a>
              <p className="text-neutral-400 text-sm">
                {tool.name}
              </p>
            </div>
          ))}

          {tools.backend.map((tool, index) => (
            <div key={`backend-${index}`} className="flex flex-col items-center gap-2 transition-transform transform hover:scale-105 duration-200">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center"
              >
                <Image
                  src={"/tools" + tool.icon}
                  alt={tool.name}
                  width={80}
                  height={80}
                  loading="eager"
                  priority={index < 5} // Prioritize first 5 images
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </a>
              <p className="text-neutral-400 text-sm">
                {tool.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="special" className="px-6 lg:px-64 py-16 flex flex-col items-center text-center gap-8">
        <h2 className="text-3xl lg:text-4xl font-bold">Special Thanks to Encore.dev</h2>
        <p className="text-base text-neutral-300 max-w-4xl">
          <a href="https://encore.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Encore.dev</a> is an open-source TypeScript backend framework that helps you build robust, type-safe APIs without boilerplate and with zero npm dependencies. It allows you to focus on your product by handling API design, infrastructure, and scalability out of the box.
        </p>
        <div className="w-full  rounded-xl overflow-hidden shadow-lg">
          <Image
            src="https://res.cloudinary.com/qntum/image/upload/v1753369052/Screenshot_2025-07-24_202714_lianaf.png"
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

      <div className="px-6 lg:px-64 py-16 flex flex-col items-center text-center gap-8">
        <p className="text-3xl lg:text-4xl font-bold">With Gratitude</p>
        <p className="">A heartfelt thank you to the friends who generously shared their feedback, time, and encouragement during this project. Your insights made this journey brighter.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
          {friends.map((friend, index) => (
            <a
              key={index}
              className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-transform transform hover:scale-105 duration-200"
              href={friend.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={friend.image}
                alt={friend.name}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
              <p className="font-medium">
                {friend.name}
              </p>
            </a>
          ))}

        </div>
      </div>

      <footer className="bg-[#030a17] text-footer-foreground border-t border-footer-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center space-y-8">
            {/* Main content */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-lg font-medium">
                <span>Developed by by Pritam Mondal</span>
              </div>
              <p className="text-footer-foreground/70 max-w-md">
                Passionate developer who loves building stuffs
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/qntum-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-footer-foreground/5 hover:bg-footer-accent/10 border border-footer-border hover:border-footer-accent/30 transition-all duration-300"
                aria-label="Visit GitHub profile"
              >
                <Github className="h-5 w-5 text-footer-foreground/70 group-hover:text-footer-accent transition-colors" />
                <span className="text-sm font-medium text-footer-foreground/70 group-hover:text-footer-accent transition-colors">
                  GitHub
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/pritammondal-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-footer-foreground/5 hover:bg-footer-accent/10 border border-footer-border hover:border-footer-accent/30 transition-all duration-300"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin className="h-5 w-5 text-footer-foreground/70 group-hover:text-footer-accent transition-colors" />
                <span className="text-sm font-medium text-footer-foreground/70 group-hover:text-footer-accent transition-colors">
                  LinkedIn
                </span>
              </a>

              <a
                href="mailto:pritammondal.dev@gmail.com"
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-footer-foreground/5 hover:bg-footer-accent/10 border border-footer-border hover:border-footer-accent/30 transition-all duration-300"
                aria-label="Send email"
              >
                <Mail className="h-5 w-5 text-footer-foreground/70 group-hover:text-footer-accent transition-colors" />
                <span className="text-sm font-medium text-footer-foreground/70 group-hover:text-footer-accent transition-colors">
                  Email
                </span>
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-footer-border/50 w-full text-center">
              <p className="text-sm text-footer-foreground/50">
                © {new Date().getFullYear()} Rflect. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Page;
