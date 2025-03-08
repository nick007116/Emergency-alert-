'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, onValue, remove } from 'firebase/database';
import { db, rtdb } from '../utils/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  // Maintain local state for fetching and rendering
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencyFilter, setEmergencyFilter] = useState("");

  /*
    Pre-Load: read existing filter from localStorage if present
    Ensures that when the component mounts, the filter is set immediately
  */
  useEffect(() => {
    const storedFilter = localStorage.getItem("emergencyFilter") || "";
    setEmergencyFilter(storedFilter);
  }, []);


    //Checks admin token for validity and provides admin details
   // Redirects to home page if unauthorized

  useEffect(() => {
    const verifyAdmin = () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/');
          return;
        }
        const decoded = JSON.parse(atob(token));
        if (Date.now() > decoded.exp || !decoded.admin) {
          localStorage.removeItem('adminToken');
          router.push('/');
          return;
        }
        setAdminInfo(decoded);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('adminToken');
        router.push('/');
      }
    };
    verifyAdmin();
  }, [router]);


  // Once admin is verified, fetch user data from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('name'));
        const snapshot = await getDocs(usersQuery);
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (adminInfo) {
      fetchUsers();
    }
  }, [adminInfo]);


//Listen for user requests in Realtime Database
// Sort requests in descending order by timestamp
  useEffect(() => {
    if (!adminInfo) return;

    const requestsRef = ref(rtdb, 'requests');
    const unsubscribe = onValue(requestsRef, snapshot => {
      try {
        const data = snapshot.val();
        if (data) {
          const requestsArray = Object.entries(data)
            .map(([id, value]) => ({
              id,
              ...value,
              timestamp: value.timestamp || Date.now()
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          setRequests(requestsArray);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error('Error processing requests:', error);
        setRequests([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminInfo]);

  // Removes admin token from localStorage and redirects back to home page
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  // Deletes a specific request from the Realtime Database
  const handleDeleteRequest = (requestId) => {
    const requestRef = ref(rtdb, `requests/${requestId}`);
    remove(requestRef)
      .then(() => console.log('Request deleted'))
      .catch((error) => console.error('Error deleting request:', error));
  };

    //Display a loading screen until data is fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  // Filter requests based on the emergencyFilter (case-insensitive)
  const filteredRequests = emergencyFilter
    ? requests.filter(
      (req) =>
        req.requestType &&
        req.requestType.toLowerCase() === emergencyFilter.toLowerCase()
    )
    : requests;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-6 shadow-xl">
        <div className="container mx-auto flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {adminInfo?.role}
            </h1>
            {emergencyFilter && (
              <>
                <span className="text-lg md:text-2xl font-light text-red-300">
                  {emergencyFilter.charAt(0).toUpperCase() + emergencyFilter.slice(1)}
                </span>
                <span className="text-lg md:text-2xl font-light text-gray-300">Dashboard</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-base md:text-lg text-gray-300">
                Welcome, {adminInfo?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 md:px-5 md:py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-md text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-red-700/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main container section */}
      <div className="container mx-auto p-6 space-y-8">

        {/* Users Section , displays registered users */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3">{user.name || 'N/A'}</td>
                    <td className="px-4 py-3">{user.age || 'N/A'}</td>
                    <td className="px-4 py-3">{user.gender || 'N/A'}</td>
                    <td className="px-4 py-3">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3">{user.mobile || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Requests Section , handles incoming emergency requests */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">User Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const requester = users.find(u => u.id === request.user);
                const userMobile = requester ? requester.mobile : null;

                return (
                  <div
                    key={request.id}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex flex-col"
                  >
                    <div className="flex flex-col mb-3 flex-grow">
                      <h3 className="text-xl font-medium">
                        {requester ? requester.name : 'Unknown User'}
                      </h3>
                      {request.requestType && (
                        <p className="text-sm text-red-400">
                          Emergency: {request.requestType}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        {new Date(request.timestamp).toLocaleString()}
                      </p>
                      <p className="text-gray-300 mt-2 text-base line-clamp-3">{request.details}</p>
                    </div>
                    <div className="flex gap-4 mt-4">
                      {request.latitude && request.longitude && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${request.latitude},${request.longitude}`,
                              '_blank'
                            )
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors flex-1"
                        >
                          Show Map
                        </button>
                      )}
                      {userMobile && (
                        <a
                          href={`tel:+91${userMobile}`}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm transition-colors flex-1 text-center"
                        >
                          Call Now
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-colors flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center col-span-full">No requests found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}