import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function AdsPlayer() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  // -------------------------------
  // Listen to ads collection
  // -------------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ads"), (snap) => {
      const list = snap.docs
        .map((d) => d.data())
        .filter((a) => a.active);
      setAds(list);
      setIndex(0);
    });

    return () => unsub();
  }, []);

  // -------------------------------
  // Handle image timing
  // -------------------------------
  useEffect(() => {
    if (ads.length === 0) return;

    const currentAd = ads[index];

    // Only auto-advance for images
    if (currentAd.type === "image") {
      timeoutRef.current = setTimeout(() => {
        nextAd();
      }, 8000); // image duration
    }

    return () => clearTimeout(timeoutRef.current);
  }, [index, ads]);

  const nextAd = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  if (ads.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-3xl">
        No Ads Available
      </div>
    );
  }

  const ad = ads[index];

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      {/* IMAGE */}
      {ad.type === "image" && (
        <img
          src={ad.url}
          alt="Advertisement"
          className="max-h-full max-w-full object-contain animate-fadeIn"
        />
      )}

      {/* VIDEO */}
      {ad.type === "video" && (
        <video
          src={ad.url}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          onEnded={nextAd}   // 🔥 THIS IS THE KEY
        />
      )}
    </div>
  );
}
