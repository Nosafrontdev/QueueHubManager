import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import SignOutButton from "./SignOutButton";

function Navbar() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
            if (currentUser){
                const ref = doc(db, 'users', currentUser.uid);
                const snap = await getDoc(ref);

                if (snap.exists()){
                    setRole(snap.data().role);
                }

            }
        
        });
        return ()=> unsubscribe();
    }, []);

    return ( 
        <nav  className="flex items-center justify-between p-4 bg-gray-100 shadow">
        <Link to = '/' className ='text-xl font-bold text-blue-600'> Queue Hub </Link>
        <div className="flex items-center gap-3">
        <h1 className="text-gray-700 font-medium"> 
            Welcome, {role || user?.email || 'Guest' } 
        </h1>
       {/* This part was suppose to hold users dp
       <img 
        src={user?.photoUrl || 'placeholder'}
        alt='users dp' 
        className = 'w-10 h-10 rounded-full' /> */}
        <SignOutButton />
        </div>
        </nav>
     );
}

export default Navbar;