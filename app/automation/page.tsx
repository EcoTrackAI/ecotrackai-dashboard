"use client";

import ApplianceControlCard from "@/components/automation/ApplianceControlCard";
import { MetricCard } from "@/components/metrics";
import { subscribePZEMData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Zap, Flame, Gauge } from "lucide-react";

export default function AutomationPage() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (_err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = subscribePZEMData((data) => {
      setPzem(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Automation Control
          </h1>
          <p className="text-[#6B7280]">
            Monitor power consumption and manually control smart devices.
          </p>
        </div>

        {/* Power Metrics */}
        {!loading && pzem && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">
              Power Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Current Power"
                value={pzem.power.toFixed(1)}
                unit="W"
                icon={<Zap className="w-6 h-6" />}
              />
              <MetricCard
                title="Total Energy"
                value={pzem.energy.toFixed(2)}
                unit="kWh"
                icon={<Flame className="w-6 h-6" />}
              />
              <MetricCard
                title="Voltage"
                value={pzem.voltage.toFixed(1)}
                unit="V"
                icon={<Gauge className="w-6 h-6" />}
              />
            </div>
          </section>
        )}

        {/* Appliance Controls */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Smart Appliances
          </h2>
          <div className="space-y-4">
            <ApplianceControlCard
              name="Bedroom Light"
              type="light"
              room="bedroom"
            />
            <ApplianceControlCard
              name="Living Room Light"
              type="light"
              room="living_room"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
