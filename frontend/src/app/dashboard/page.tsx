"use client";
import { useState, useEffect } from 'react';
import { api, setAccessToken, clearAccessToken } from '../../lib/api';   // Update import
import type { _Class, Student } from '../../lib/api';
import Search  from '@/components/search';
import ClassList from '@/components/classList';

export default function Dashboard() {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<_Class[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.get('/students/me');   // or wherever your profile route is
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error(e);
    } finally {
      clearAccessToken();           // from api.ts
      window.location.href = "/";
    }
  };
  
  const [ search, setSearch ] = useState("");
  const handleSubmit = () => {}


  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen w-98 flex flex-col">


      {/* //Main content */}
      <div className="h-screen mt-24 w-full flex flex-col items-center ">
        <button className="bg-orange-500 w-1/12 h-[20px]" onClick={handleLogout}></button>
        <div>

        </div>
        {/*image div */}
        <div className="w-11/12 bg-dashboard-bg bg-cover h-2/6 min-h-[100px] rounded-lg"/>
        {/* sidebar | content*/}  
        <div className="flex bg justify-between w-11/12 h-1/12 mt-8 ">
          {/* sidebar */}
          <div className=" w-3/6 flex-col border-orange-600 flex">
            <p className="font-['Brush_Script_MT'] self-start md:text-3xl text-lg">
              {(user?.faculty ?? '').charAt(0).toUpperCase() + (user?.faculty ?? '').slice(1)} {user?.department?.toLowerCase()} Department
            </p>
            <div className="">
              <span className="text-s text-gray-400">Ongoing-classes</span> 
              <span className="text-xs font-bold pl-1">4+</span>
              <span> welcome @{user?.username}</span>
            </div>
            <hr className="mt-5"/>
          </div>
          {/* Content div */}
          <div className=" relative w-full h-7/12">
            {/* search bar/ greeting */}
          <div className="w-full flex-row justify-end">
            <Search/>
          </div>
          </div>
        </div>
      <div className="h-auto align-center w-11/12 ">
         <ClassList/>
      </div>

      </div>
      </div>
  )
}

