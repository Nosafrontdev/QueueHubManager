import {useEffect, useState} from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp,getDocs, query, orderBy } from 'firebase/firestore';


function Cardgiver() {

    const [nextNumber, setNextNumber] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchLastQueueNumber = async () => {
            const q = query(collection (db, 'queue'), orderBy('number', 'desc'));
             const snap = await getDocs(q);

             if (!snap.empty){
                const highest = snap.docs[0].data().number;
                setNextNumber(highest+1);
             }
             setLoading(false);

        };
        fetchLastQueueNumber();

    }, []);

    const issueNumber = async() => {
        try{
            await addDoc(collection(db, 'queue'), {
                number: nextNumber,
                createdAt: serverTimestamp(),
                served: false,
            });

            alert(`Patient number ${nextNumber} issued!`);
            setNextNumber(nextNumber +1);
        }
         catch (error){
            console.log(error);
            alert('error issuing number');
         }

    };
    if (loading) return <div> Loading Queue</div>;
    return (  
        <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Card Giver Panel</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold">Next Number: {nextNumber}</h2>

        <button
          onClick={issueNumber}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Issue Number
        </button>
      </div>
    </div>
       
    );
}

export default Cardgiver;