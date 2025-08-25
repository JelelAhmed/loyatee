"use client";

import { useState, useEffect } from "react";
import { fetchDataStationPlans } from "@/app/actions/data.actions";

type DataPlan = {
  vendor_plan_id: string;
  network_code: string;
  data_size: string;
  price: number;
  duration: string;
};

type FetchResult = {
  plans: DataPlan[];
  error: string | null;
  rawResponse: string | null;
};

export default function DataStationTest() {
  const [result, setResult] = useState<FetchResult>({
    plans: [],
    error: null,
    rawResponse: null,
  });

  useEffect(() => {
    async function fetchPlans() {
      const data = await fetchDataStationPlans();
      setResult(data);
    }
    fetchPlans();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DataStation API Test</h1>
      {result.error && (
        <p className="text-red-500 mb-4">Error: {result.error}</p>
      )}
      {result.rawResponse && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Raw Response:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {result.rawResponse}
          </pre>
        </div>
      )}
      <h2 className="text-xl font-semibold">Plans:</h2>
      {result.plans.length > 0 ? (
        <ul className="list-disc pl-5">
          {result.plans.map((plan) => (
            <li key={plan.vendor_plan_id}>
              {plan.network_code}: {plan.data_size} - ₦{plan.price} (
              {plan.duration})
            </li>
          ))}
        </ul>
      ) : (
        <p>No plans available.</p>
      )}
    </div>
  );
}
