import { useState } from 'react'
import ProfileManager from './ProfileManager'
import AdminMessages from './AdminMessages'
import {
  LayoutDashboard, UserRound, Images, Share2, FolderKanban,
  Palette, Settings, Globe, LogOut, Menu, X, Camera,
  Eye, ArrowUpRight, Sparkles, MessageSquare
} from 'lucide-react'

type Props = {
  onLogout: () => void
}

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Profile', icon: UserRound },
  { name: 'Gallery', icon: Images },
  { name: 'Social Links', icon: Share2 },
  { name: 'Projects', icon: FolderKanban },
  { name: 'Appearance', icon: Palette },
  { name: 'Settings', icon: Settings },
  { name: 'Messages', icon: MessageSquare },
]

export default function AdminDashboard({ onLogout }: Props) {
  const [active, setActive] = useState('Overview')
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-[#080808] text-white md:flex">
      <aside className={`${mobileMenu ? 'fixed inset-0 z-50 flex' : 'hidden'} w-full flex-col border-r border-[#d4af37]/20 bg-[#0d0d0d] p-6 md:sticky md:top-0 md:flex md:h-screen md:w-72 md:shrink-0`}>
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-wider text-[#d4af37]">TAMIM.</h1>
            <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-500">ADMIN CONTROL PANEL</p>
          </div>
          <button onClick={() => setMobileMenu(false)} className="md:hidden"><X /></button>
        </div>

        <p className="mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-600">MAIN MENU</p>
        <nav className="flex-1 space-y-2">
          {navigation.map(item => (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name)
                setMobileMenu(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                active === item.name
                  ? 'border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-5">
          <a href="/" className="mb-4 flex items-center gap-3 px-4 text-sm text-gray-400 hover:text-[#d4af37]">
            <Globe size={18} /> View Website
          </a>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)} className="rounded-lg border border-white/10 p-2 md:hidden"><Menu /></button>
            <div>
              <p className="text-xs tracking-widest text-gray-500">TAMIM TH. EDITOR / ADMIN</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{active}</h2>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 px-4 py-2 text-xs text-[#d4af37] sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" /> ADMIN PANEL
          </div>
        </header>

        {active === 'Overview' ? (
          <>
            <div className="mb-8 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-r from-[#17140b] to-[#101010] p-7 sm:p-10">
              <Sparkles className="mb-5 text-[#d4af37]" size={30} />
              <p className="text-xs tracking-[0.25em] text-[#d4af37]">WELCOME BACK, ADMIN</p>
              <h3 className="mt-3 text-3xl font-black sm:text-4xl">Your Creative <span className="text-[#d4af37]">Studio.</span></h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">Manage your personal website, creative identity, gallery and projects from one place.</p>
              <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-black">Visit Website <ArrowUpRight size={17} /></a>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { title: 'Profile', detail: 'Personal information', icon: UserRound, target: 'Profile' },
                { title: 'Photo Gallery', detail: 'Manage your photos', icon: Images, target: 'Gallery' },
                { title: 'Social Links', detail: 'Your social accounts', icon: Share2, target: 'Social Links' },
                { title: 'Projects', detail: 'Showcase your work', icon: FolderKanban, target: 'Projects' },
                { title: 'Appearance', detail: 'Website visual settings', icon: Palette, target: 'Appearance' },
                { title: 'Website Settings', detail: 'Manage website sections', icon: Settings, target: 'Settings' },
              ].map(card => (
                <button key={card.title} onClick={() => setActive(card.target)} className="rounded-2xl border border-white/10 bg-[#111] p-6 text-left transition hover:border-[#d4af37]/40 hover:bg-[#17140b]">
                  <card.icon className="mb-5 text-[#d4af37]" size={25} />
                  <h4 className="font-bold">{card.title}</h4>
                  <p className="mt-2 text-xs text-gray-500">{card.detail}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs text-[#d4af37]">Open section <ArrowUpRight size={14} /></span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
              <div className="flex items-center gap-3">
                <Eye className="text-[#d4af37]" />
                <div>
                  <h4 className="font-bold">Website Status</h4>
                  <p className="mt-1 text-xs text-gray-500">Your public website preview</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-gray-400">Your website is connected to the current frontend. Content management features will be connected in the next steps.</p>
            </div>
          </>
        ) : active === 'Profile' ? (
          <ProfileManager />
        ) : active === 'Messages' ? (
          <AdminMessages />
        ) : (
          <div className="rounded-2xl border border-[#d4af37]/20 bg-[#111] p-8 sm:p-12">
            <Camera className="mb-5 text-[#d4af37]" size={32} />
            <h3 className="text-2xl font-bold">{active} Management</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">This section is ready for its management tools. We will connect its forms, uploads and database features in the next steps.</p>
            <button onClick={() => setActive('Overview')} className="mt-7 rounded-xl border border-[#d4af37]/40 px-5 py-3 text-sm text-[#d4af37]">Back to Overview</button>
          </div>
        )}
      </main>
    </div>
  )
}
