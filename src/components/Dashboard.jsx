import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FiHome, FiBriefcase, FiUsers, FiCalendar, FiSettings, FiLogOut, FiPieChart, FiCheckCircle, FiClock } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Sample data
  const projects = [
    { id: 1, name: "Website Redesign", progress: 75, due: "May 30" },
    { id: 2, name: "Mobile App Development", progress: 45, due: "Jun 15" },
    { id: 3, name: "Marketing Campaign", progress: 90, due: "May 25" },
  ];

  const tasks = [
    { id: 1, title: "Review wireframes", project: "Website Redesign", status: "completed" },
    { id: 2, title: "API integration", project: "Mobile App", status: "in-progress" },
    { id: 3, title: "Content creation", project: "Marketing", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <h2 className="text-xl font-bold">Project Collab</h2>
            <p className="text-blue-100 text-sm">Dashboard</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 text-indigo-700">
              <FiHome className="h-5 w-5" />
              <span>Overview</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <FiBriefcase className="h-5 w-5" />
              <span>Companies</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <FiUsers className="h-5 w-5" />
              <span>Team</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <FiCalendar className="h-5 w-5" />
              <span>Calendar</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <FiSettings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
          
          <div className="p-4 border-t mt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-red-500 w-full"
            >
              <FiLogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiBriefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tasks Completed</p>
                  <p className="text-2xl font-bold">48</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FiClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending Tasks</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Active Projects</h2>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{project.name}</h3>
                    <span className="text-sm text-gray-500">Due: {project.due}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700">{project.progress}% complete</span>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Tasks</h2>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'completed'} 
                      className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.project}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;