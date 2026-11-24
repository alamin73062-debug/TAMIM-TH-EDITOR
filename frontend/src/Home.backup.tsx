import { useState } from 'react'
import {
  Menu, X, Globe, Users, Video, Send,
  ArrowUpRight, Sparkles, Camera, Code2,
  User, Mail
} from 'lucide-react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="fixed top-0 z-50 w-full border-b border-[#d4af37]/20 bg-black/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <a href="#home" className="text-xl font-black tracking-widest text-[#d4af37]">TAMIM.</a>
          <div className="hidden gap-8 md:flex">
            {links.map(link => <a key={link.name} href={link.href} className="text-sm text-gray-300 hover:text-[#d4af37]">{link.name}</a>)}
          </div>
          <a href="#contact" className="hidden rounded-full border border-[#d4af37] px-5 py-2 text-sm text-[#d4af37] md:block">Let's Connect</a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#d4af37] md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {menuOpen && <div className="flex flex-col gap-5 border-t border-white/10 bg-black p-6 md:hidden">
          {links.map(link => <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>{link.name}</a>)}
        </div>}
      </header>

      <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-[120px]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-7 text-xs font-bold tracking-[0.3em] text-[#d4af37]">— WELCOME TO MY WORLD</p>
          <p className="mb-3 text-lg tracking-widest text-gray-400">HELLO, I'M</p>
          <h1 className="text-5xl font-black leading-tight sm:text-7xl lg:text-8xl">TAMIM<span className="block text-[#d4af37]">TH. EDITOR</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">Welcome to my creative world. Explore my identity, creativity, projects and the work that represents me.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#about" className="flex items-center gap-2 rounded-full bg-[#d4af37] px-7 py-3.5 font-bold text-black">Discover More <ArrowUpRight size={18} /></a>
            <a href="#projects" className="rounded-full border border-white/20 px-7 py-3.5">My Projects</a>
          </div>
          <div className="mt-20 border-t border-white/10 pt-7 text-xs tracking-widest text-gray-500">CREATIVE MIND　•　DIGITAL WORLD　•　MY IDENTITY</div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-28">
        <p className="mb-4 text-sm tracking-widest text-[#d4af37]">01 — ABOUT ME</p>
        <h2 className="mb-8 text-4xl font-bold">The Person Behind <span className="text-[#d4af37]">The Vision.</span></h2>
        <div className="max-w-3xl rounded-2xl border border-[#d4af37]/20 bg-white/[0.03] p-8">
          <User className="mb-5 text-[#d4af37]" size={32} />
          <p className="text-lg leading-8 text-gray-400">I believe every person has a unique story. This is my personal space to share my journey, creative work, interests and the things I build. More about me coming soon.</p>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm tracking-widest text-[#d4af37]">02 — GALLERY</p>
          <h2 className="mb-10 text-4xl font-bold">My <span className="text-[#d4af37]">Gallery.</span></h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(item => <div key={item} className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4af37]/30 bg-black/50 text-gray-500">
              <Camera size={35} className="mb-3 text-[#d4af37]" /><span>Photo {item} — Coming Soon</span>
            </div>)}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <p className="mb-4 text-sm tracking-widest text-[#d4af37]">03 — MY WORK</p>
        <h2 className="mb-10 text-4xl font-bold">Creative <span className="text-[#d4af37]">Projects.</span></h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.03] p-8">
            <Sparkles className="mb-5 text-[#d4af37]" size={30} /><h3 className="mb-3 text-xl font-bold">Creative Editing</h3><p className="leading-7 text-gray-400">A collection of my creative editing and visual experiments.</p>
          </div>
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.03] p-8">
            <Code2 className="mb-5 text-[#d4af37]" size={30} /><h3 className="mb-3 text-xl font-bold">Digital Projects</h3><p className="leading-7 text-gray-400">My websites, applications and other digital creations.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 border-t border-[#d4af37]/20 bg-white/[0.02] px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-sm tracking-widest text-[#d4af37]">04 — GET IN TOUCH</p>
          <h2 className="text-4xl font-bold">Let's Connect <span className="text-[#d4af37]">Together.</span></h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-400">Find me on social media and follow my creative journey.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              { icon: Globe, name: 'Instagram' },
              { icon: Users, name: 'Facebook' },
              { icon: Video, name: 'YouTube' },
              { icon: Send, name: 'Telegram' },
              { icon: Code2, name: 'GitHub' },
              { icon: Mail, name: 'Email' },
            ].map(item => <div key={item.name} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-gray-300">
              <item.icon size={17} className="text-[#d4af37]" />{item.name}
            </div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-xs text-gray-500">© {new Date().getFullYear()} TAMIM TH. EDITOR — ALL RIGHTS RESERVED</footer>
    </main>
  )
}
