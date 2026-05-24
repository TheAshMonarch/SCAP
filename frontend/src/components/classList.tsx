import React, { useState } from 'react';

// 1. Class Structure
class Developer {
  constructor(id: number, name: string, role: string, skill: string, professor = "N/A", status = "Active") {
    this.id = id;
    this.name = name;
    this.role = role;
    this.skill = skill;
    this.professor = professor;
    this.status = status;
  }
  id: number;
  name: string;
  role: string;
  professor: string;
  status: string;
  skill: string;
}

// 2. Data List
const initialDevs = [
  new Developer(1, "Alice Johnson", "Frontend Engineer", "React", "Dr. Smith", "Active"),
  new Developer(2, "Bob Vance", "Backend Engineer", "Node.js", "N/A", "On Bench"),
  new Developer(3, "Charlie Green", "Fullstack Developer", "Next.js", "Dr. Jones", "Active"),
  new Developer(4, "Alice Johnson", "Frontend Engineer", "React", "Dr. Smith", "Active"),
  new Developer(5, "Bob Vance", "Backend Engineer", "Node.js", "N/A", "On Bench"),
  new Developer(6, "Charlie Green", "Fullstack Developer", "Next.js", "Dr. Jones", "Active"),
  new Developer(7, "Alice Johnson", "Frontend Engineer", "React", "Dr. Smith", "Active"),
  new Developer(8, "Bob Vance", "Backend Engineer", "Node.js", "N/A", "On Bench"),
  new Developer(9, "Charlie Green", "Fullstack Developer", "Next.js", "Dr. Jones", "Active"),
  new Developer(10, "Alice Johnson", "Frontend Engineer", "React", "Dr. Smith", "Active"),
  new Developer(11, "Bob Vance", "Backend Engineer", "Node.js", "N/A", "On Bench"),
  new Developer(12, "Charlie Green", "Fullstack Developer", "Next.js", "Dr. Jones", "Active")
];

// 3. UI Row Component with Tailwind
function DevRow({ dev }: any) {
  const initials = dev.name.split(' ').map(n => n[0]).join('');
  const isActive = dev.status === "Active";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 transition-colors">
      
      {/* Name and Avatar */}
      <div className="flex items-center gap-4 w-full sm:w-64">
        <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm shrink-0">
          {initials}
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 leading-tight">{dev.name}</h4>
          <span className="text-xs text-slate-500">{dev.role}</span>
        </div>
      </div>

      {/* Tech Badge */}
      <div className="flex flex-col justify-center min-w-[120px]">
        <span className="inline-flex items-center justify-center self-start px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          {dev.skill}
        </span>
      </div>

      {/* Professor / Mentor */}
      <div className="flex flex-col min-w-[150px]">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mentor / Prof</span>
        <span className="text-sm font-medium text-slate-700">{dev.professor}</span>
      </div>

      {/* Status Dot Indicator */}
      <div className="flex items-center gap-2 w-28">
        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span className="text-sm font-medium text-slate-700">{dev.status}</span>
      </div>
      
    </div>
  );
}

// 4. Main TechTown Layout Component
export default function TechTownDashboard() {
  const [devs] = useState(initialDevs);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Sidebar Panel */}
      <aside className="hidden md:flex flex-col w-60 bg-gradient-to-b from-red-600 to-red-300 text-white p-6">
        <div className="text-xl font-bold tracking-wide text-green-400 mb-10 px-3">
          TechTown
        </div>
        <nav className="flex flex-col gap-1">
          <div className="p-3 rounded-lg text-sm font-semibold bg-slate-800 text-white cursor-pointer">
            Developers
          </div>
          <div className="p-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
            Projects
          </div>
          <div className="p-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
            Labs
          </div>
        </nav>
      </aside>

      {/* Main Container Workspace */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        
        {/* Dynamic Header Block */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Developer Directory</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Manage and monitor community tech talent profiles</p>
          </div>
          <span className="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
            Total: {devs.length}
          </span>
        </header>

        {/* Directory Stack Layout */}
        <div className="flex flex-col gap-4">
          {devs.map((developer) => (
            <DevRow key={developer.id} dev={developer} />
          ))}
        </div>

      </main>
    </div>
  );
}
