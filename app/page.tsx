"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col">
      {/* ── Navbar ── */}
      <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold text-gray-800">EchoMind</span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Login
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Badge */}
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full mb-6">
          AI-Powered Education Platform
        </span>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
          Preserve Knowledge.{" "}
          <span className="text-blue-600">Close Every Gap.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed">
          EchoMind creates a permanent AI twin of any educator and finds exactly
          why a student is struggling — then fixes it.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-base"
          >
            I'm a Teacher
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors text-base"
          >
            I'm a Student
          </button>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">🧠</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Knowledge Twin</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Upload notes and lectures. AI builds a permanent digital version
              of the educator.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Gap Detection</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI finds the root cause of why a student is struggling — not just
              the symptom.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🗺️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Recovery Roadmap
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Personalized learning path generated in the educator's own
              teaching style.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        EchoMind — Built for educators and students everywhere.
      </footer>
    </main>
  );
}
