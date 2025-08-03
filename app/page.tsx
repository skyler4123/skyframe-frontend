import Image from "next/image";
import { EnvironmentDebugger } from "@/components/EnvironmentDebugger";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      {/* Environment Debug Info (only in development) */}
      {config.features.debugMode && <EnvironmentDebugger />}
      
      <header className="py-6 px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="https://docs.chaicode.com/_astro/chai-white.DwCnUyBG_Zxcape.webp" alt="Chai Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">ChaiCode</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-amber-400 transition">Docs</a>
            <a href="#" className="hover:text-amber-400 transition">Tutorials</a>
            <a href="#" className="hover:text-amber-400 transition">Community</a>
            <a href="#" className="hover:text-amber-400 transition">About</a>
          </nav>
          <button className="md:hidden text-2xl">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Docs You'll <span className="gradient-text">Actually Read</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Next-gen docs that builds reading habits into your workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://docs.chaicode.com/youtube/getting-started/"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full hover-scale transition">
              Start Learning
            </a>
            <a href="https://courses.chaicode.com/learn"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover-scale transition flex items-center justify-center gap-2">
              <i className="fas fa-play"></i> Watch Tutorials
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-800 rounded-3xl mx-4 sm:mx-8 lg:mx-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img src="https://docs.chaicode.com/_astro/houston-love.BttrNCcZ_rVNmG.webp"
                         alt="Community"
                         className="rounded-2xl shadow-xl w-full max-w-md mx-auto" />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Have a question or want to get involved..?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join our vibrant community of learners and developers. Get help, share knowledge, and grow together.
            </p>
            <a href="https://hitesh.ai/discord"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full hover-scale transition inline-flex items-center gap-2">
              <i className="fab fa-discord"></i> Join our Discord
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src="https://docs.chaicode.com/_astro/chai-gray.BsQ6Sk6A_Z2kh8Da.webp"
                         alt="ChaiCode Logo"
                         className="h-12 w-auto opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Brought to you by ChaiCode</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Chai aur Code is an unique initiative by Hitesh Choudhary where he mentors people who want to learn programming
            and grow in the field.
          </p>
          <a href="https://chaicode.com/"
            className="inline-block border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900 font-medium py-2 px-6 rounded-full transition">
            Learn about ChaiCode
          </a>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <i className="fab fa-youtube text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2023 ChaiCode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
