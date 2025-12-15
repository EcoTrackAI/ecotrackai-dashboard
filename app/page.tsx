"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

export default function Home() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const liveRef = ref(db, "live");

    const unsubscribe = onValue(liveRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">EcoTrack AI Dashboard</h1>

      {!data ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 max-w-xl">
          <Card title="Temperature" value={`${data.temperature} °C`} />
          <Card title="Humidity" value={`${data.humidity} %`} />
          <Card title="Light" value={`${data.light} %`} />
          <Card title="Motion" value={data.motion ? "Detected" : "None"} />
        </div>
      )}
    </main>
  );
}

function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>
  );
}
