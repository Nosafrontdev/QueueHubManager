import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom"
import Login from './pages/Login';

import FrontDesk from "./pages/FrontDesk";
import Admin from "./pages/Admin";
import CardGiver from "./pages/CardGiver";


import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import CentralScreen from "./components/CentralScreen";


function App() {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged  (auth, async (currentUser) => {
      if (currentUser){
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDoc.exists()){
          setRole(userDoc.data().role);
        }
      
     setUser(currentUser);
    } else{
      setUser(null);
      setRole(null);
    }
    setLoading(false);
    });
    return () => unsubscribe();
  } ,[]);
  
  if (loading){
    return <div> Loading, please wait .......</div>
  }

    const redirectByRole = () => {
    if (!user) return <Login />;

    if (role === "Admin") return <Navigate to="/admin" />;
    if (role === "cardGiver") return <Navigate to="/cardgiver" />;
    if (role?.startsWith("frontdesk")) return <Navigate to="/frontdesk" />;

    return <Login />;
    };

  return (
    <BrowserRouter>
    <Routes>
      <Route  path ='/' element = {redirectByRole()} />
      <Route path = "/CardGiver" element = {<ProtectedRoute user = {user}> <CardGiver /> </ProtectedRoute>  } />
      <Route path = "/FrontDesk" element = {<ProtectedRoute user = {user}> <FrontDesk /> </ProtectedRoute>  } />
      <Route path = "/admin" element = {<ProtectedRoute user = {user}> <Admin /> </ProtectedRoute>  } />
      
    
 
 
    </Routes>
    </BrowserRouter>
  );
}

export default App;
