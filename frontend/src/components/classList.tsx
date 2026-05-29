import React, { useState, useEffect } from 'react';
import { api, _Class } from '../lib/api';   
import { GiAbstract084 } from 'react-icons/gi';
// 1. Clean Tailwind Row Component for your Classes
function ClassRow({ scheduleData }: { scheduleData: _Class }) {
  // Grab the readable course title, fallback gracefully if data is missing
  const courseTitle = scheduleData.course?.courseTitle || "Untitled Course";
  const courseCode = scheduleData.course?.courseCode || "N/A";
  
  // Create an avatar circle using the first two characters of the course code/title
  const shortCode = courseCode.substring(0, 4).toUpperCase();

  return (
    <div className="flex flex-col w-full sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 transition-colors">
      
      {/* Course Title and Code Avatar */}
      <div className="flex items-center gap-4 w-full sm:w-72">
        <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 tracking-tight border border-red-100">
          {shortCode}
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900个人 leading-tight">{courseTitle}</h4>
          <span className="text-xs font-mono text-slate-400">CourseCode: {courseCode}</span>
        </div>
      </div>

      {/* Venue/Location Badge */}
      <div className="flex flex-col justify-center min-w-[120px]">
        <span className="inline-flex items-center justify-center self-start px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          📍 {scheduleData.venue}
        </span>
      </div>

      {/* Assigned Professor */}
      <div className="flex flex-col min-w-[150px]">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Professor</span>
        <span className="text-sm font-medium text-slate-700">{scheduleData.professor || "No Mentor Assigned"}</span>
      </div>

      {/* Schedule Time Indicators */}
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Schedule</span>
        <span className="text-sm font-semibold text-slate-800">{scheduleData.schedule}</span>
        {scheduleData.time && <span className="text-xs text-slate-500">{scheduleData.time}</span>}
      </div>
      
    </div>
  );
}

// 2. Main TechTown Dashboard
export default function TechTownDashboard() {
  // Always initialize state with an empty array [] instead of undefined to prevent mapping errors on initial render
  const [classes, setClasses] = useState<_Class[]>([]);

  useEffect(() => {
    console.log("Fetching student class data on component mount...");
    const loadClasses = async () => {
      try {
        const data = await api.get("/students/me/classes");
        setClasses(data);
        console.log("Successfully retrieved classes:", data);
      } catch (error) {
        console.error("Failed to load classes", error);
      }
    };

    loadClasses();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Sidebar Panel */}
      <aside className="hidden md:flex flex-col w-60 bg-gradient-to-b from-red-600 to-red-800 text-white p-6 shadow-xl">
        <div className="text-xl font-black tracking-wider text-white mb-10 px-3 border-b border-red-500 pb-4">
         <span> {<GiAbstract084/>} </span> SCAP HUB
        </div>
        <nav className="flex flex-col gap-1">
          <div className="p-3 rounded-lg text-sm font-semibold bg-slate-900 text-white shadow-inner cursor-pointer">
            My Classes yo
          </div>
          <div className="p-3 rounded-lg text-sm font-medium text-red-100 hover:bg-red-700 transition-colors cursor-pointer">
            Enrolled Courses
          </div>
          <div className="p-3 rounded-lg text-sm font-medium text-red-100 hover:bg-red-700 transition-colors cursor-pointer">
            Campus Venues
          </div>
        </nav>
      </aside>

      {/* Main Container Workspace */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        
        {/* Dynamic Header Block */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold w-full text-slate-900 tracking-tight">Academic Schedule</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Real-time breakdown of your active semester modules and lecture halls</p>
          </div>
          <span className="bg-sky-50 text-sky-700 px-4 py-2 rounded-full text-xs font-bold shrink-0 border border-sky-200">
            Total Modules: {classes.length}
          </span>
        </header>

        {/* Directory Stack Layout */}
        <div className="flex flex-col gap-4 w-full">
          {classes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-sm font-medium">
              No classes found for this account.
            </div>
          ) : (
            classes.map((singleClass) => (
              <ClassRow 
                key={singleClass._id} 
                scheduleData={singleClass} 
              />
            ))
          )}
        </div>

      </main>
    </div>
  );
}
