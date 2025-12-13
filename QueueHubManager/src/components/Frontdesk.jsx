import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { auth } from "../firebase";

function Frontdesk() {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deskRole, setDeskRole] = useState("");

  // --------------------------------------------------
  // Get this officer's role (frontdesk1–frontdesk5)
  // --------------------------------------------------
  useEffect(() => {
    async function loadRole() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setDeskRole(userSnap.data().role); // "frontdesk3" etc
      }
    }
    loadRole();
  }, []);

  // --------------------------------------------------
  // FETCH NEXT PATIENT
  // --------------------------------------------------
  const fetchNext = async () => {
    if (!deskRole.startsWith("frontdesk")) {
      alert("You are not authorized for this action.");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "queue"),
        where("served", "==", false),
        orderBy("number", "asc"),
        limit(1)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("No patient waiting.");
        setCurrentPatient(null);
        setLoading(false);
        return;
      }

      const docData = snap.docs[0];
      const patient = { id: docData.id, ...docData.data() };

      // Mark as served + add servedBy
      await updateDoc(doc(db, "queue", patient.id), {
        served: true,
        servedAt: serverTimestamp(),
        servedBy: deskRole, // <<< CRITICAL
      });

      setCurrentPatient(patient);

    } catch (error) {
      console.error(error);
      alert("Error fetching next patient.");
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        {deskRole ? deskRole.toUpperCase() : "Front Desk"}
      </h1>

      <div className="bg-white p-6 w-80 rounded-xl shadow-md">
        <button
          onClick={fetchNext}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Loading..." : "Next Patient"}
        </button>

        {currentPatient && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
            <p className="text-xl font-bold">
              Now Serving: {currentPatient.number}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Frontdesk;