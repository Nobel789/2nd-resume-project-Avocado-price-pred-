"use client";

import { useMemo, useState } from "react";

const initialForm = {
  region: "",
  year: "",
  date: "",
  totalVolume: "",
  totalBags: ""
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function getPrediction({ region, year, date, totalVolume, totalBags }) {
  const safeYear = Number(year) || 0;
  const safeVolume = Number(totalVolume) || 0;
  const safeBags = Number(totalBags) || 0;
  const month = date ? new Date(date).getMonth() + 1 : 0;
  const regionBoost = region ? Math.min(region.length * 0.02, 0.6) : 0;

  const base = 1.25;
  const yearTrend = (safeYear - 2015) * 0.08;
  const seasonality = month ? Math.sin((month / 12) * Math.PI * 2) * 0.15 : 0;
  const volumeImpact = safeVolume * -0.0000008;
  const bagsImpact = safeBags * 0.00004;

  return Math.max(
    0.5,
    base + yearTrend + seasonality + volumeImpact + bagsImpact + regionBoost
  );
}

export default function Home() {
  const [formState, setFormState] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const prediction = useMemo(() => getPrediction(formState), [formState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormState(initialForm);
    setSubmitted(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Avocado price assistant
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Average prediction of Avocado price
          </h1>
          <p className="text-sm text-slate-300 sm:text-base">
            Fill in a few simple details and get a friendly estimate for average avocado prices.
            This demo uses a lightweight formula so beginners can understand the flow.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Region
              <input
                type="text"
                name="region"
                value={formState.region}
                onChange={handleChange}
                placeholder="e.g. West"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Year
              <input
                type="number"
                name="year"
                value={formState.year}
                onChange={handleChange}
                placeholder="e.g. 2024"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Date
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Total Volume
              <input
                type="number"
                name="totalVolume"
                value={formState.totalVolume}
                onChange={handleChange}
                placeholder="e.g. 120000"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Total Bags
              <input
                type="number"
                name="totalBags"
                value={formState.totalBags}
                onChange={handleChange}
                placeholder="e.g. 56000"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Predict average price
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Reset
            </button>
          </div>
        </form>

        <section className="mt-8 grid gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Estimated price
            </span>
            <p className="text-3xl font-bold text-white">
              {formatter.format(prediction)}
            </p>
            <p className="text-sm text-slate-200">
              {submitted
                ? "Based on your inputs, this is the estimated average avocado price."
                : "Submit the form to lock in your estimate."}
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <h2 className="text-sm font-semibold text-white">How this works</h2>
              <p className="mt-2 text-sm text-slate-300">
                The demo uses a simple formula that blends year trends, seasonal timing, and
                how much fruit moved through the market.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <h2 className="text-sm font-semibold text-white">Beginner tips</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Try a different region name and see the estimate shift.</li>
                <li>Higher total volume usually nudges prices down.</li>
                <li>Use the reset button to start fresh.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
