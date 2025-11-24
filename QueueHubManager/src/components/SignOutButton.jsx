import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function SignOutButton() {
    const handleSignOut = async () => {
        try{
            await signOut(auth);
        }
        catch (error){
            alert('error signing out, please try again', error);
        }
    };
    return ( 
        <button onClick={handleSignOut}
        className='px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition font-medium'>
            Sign Out
        </button>
     );
}

export default SignOutButton;