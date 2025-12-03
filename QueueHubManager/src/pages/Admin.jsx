import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";

function Admin() {
    return ( 
        <>
        <Navbar />
        <SignOutButton />
        <p> This is the Admin Page </p>
        </>
     );
}

export default Admin;