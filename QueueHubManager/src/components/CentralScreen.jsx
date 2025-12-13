import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AdsPlayer from "./AdsPlayer";

export default function CentralScreen() {
  const [queue, setQueue] = useState([]);
  const [lastId, setLastId] = useState("");
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "queue"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueue(list);
    });

    return () => unsub();
  }, []);

  const activePatients = queue.filter(
    (p) => p.served === true && p.servedBy
  );
  const waitingPatients = queue.filter((p) => !p.served);

  // Announce and show queue
  useEffect(() => {
    if (activePatients.length === 0) return;

    const latest = activePatients[activePatients.length - 1];

    if (latest.id !== lastId) {
      setLastId(latest.id);

      // SPEAK
      const desk = latest.servedBy.replace("frontdesk", "");
      const text = `Patient number ${latest.number}. Please proceed to front desk ${desk}.`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

      // Show queue for 15 seconds
      setShowQueue(true);
      setTimeout(() => setShowQueue(false), 15000);
    }
  }, [activePatients]);

  // If should show ads
  if (!showQueue) return <AdsPlayer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 text-white">

      <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wide">
        QUEUE DISPLAY
      </h1>

      <h2 className="text-3xl font-bold mb-4 text-yellow-300">Currently Serving</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3, 4, 5].map((desk) => {
          const role = `frontdesk${desk}`;
          const patient = activePatients
            .filter((p) => p.servedBy === role)
            .sort((a, b) => b?.servedAt?.seconds - a?.servedAt?.seconds)[0];

          return (
            <div key={desk} className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-300">
                FRONT DESK {desk}
              </h3>
              <p className="text-6xl text-center mt-4">
                {patient ? patient.number : "---"}
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="text-3xl font-bold mb-4 text-blue-300">Waiting Patients</h2>

      <div className="bg-white/10 rounded-xl p-6">
        {waitingPatients.length === 0 ? (
          <p className="text-center text-xl text-yellow-300 py-6">
            No patients waiting
          </p>
        ) : (
          <table className="w-full">
            <tbody>
              {waitingPatients.map((p) => (
                <tr key={p.id} className="border-b border-white/20">
                  <td className="py-3 text-yellow-300 font-bold text-xl">
                    {p.number}
                  </td>
                  <td>
                    {p.createdAt?.seconds
                      ? new Date(
                          p.createdAt.seconds * 1000
                        ).toLocaleTimeString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
