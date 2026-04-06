"use client";

import React, { useRef } from "react";

const TOTAL_BUTTONS = 3000;

// OAT button variants: primary (default), secondary, danger, outline, ghost
const buttonGroups: Array<{
  dataVariant?: string;
  className?: string;
}> = [
  // Primary (default)
  { dataVariant: undefined, className: undefined },
  // Secondary
  { dataVariant: "secondary" },
  // Danger
  { dataVariant: "danger" },
  // Outline primary
  { dataVariant: undefined, className: "outline" },
  // Ghost
  { dataVariant: undefined, className: "ghost" },
  // Small secondary
  { dataVariant: "secondary", className: "small" },
];

export default function PerfOatPage() {
  const [inputValue, setInputValue] = React.useState("OAT Button");
  const [debouncedValue, setDebouncedValue] = React.useState("OAT Button");
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<{ render: number; paint: number; total: number } | null>(null);
  const [metrics, setMetrics] = React.useState<{ render: number; paint: number; total: number } | null>(null);
  const [status, setStatus] = React.useState<"idle" | "running" | "done">("idle");

  const runBenchmark = React.useCallback((text: string) => {
    const container = containerRef.current;
    if (!container) return;

    setStatus("running");
    setMetrics(null);
    container.innerHTML = "";

    const t0_start = performance.now();
    const fragment = document.createDocumentFragment();
    const label = text || "OAT";

    for (let i = 0; i < TOTAL_BUTTONS; i++) {
      const group = buttonGroups[i % buttonGroups.length];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${label} ${i + 1}`;
      if (group.dataVariant) btn.setAttribute("data-variant", group.dataVariant);
      if (group.className) btn.className = group.className;
      fragment.appendChild(btn);
    }

    container.appendChild(fragment);
    const t1_dom = performance.now();

    setTimeout(() => {
      const t3_paint = performance.now();
      const result = {
        render: parseFloat((t1_dom - t0_start).toFixed(2)),
        paint: parseFloat((t3_paint - t1_dom).toFixed(2)),
        total: parseFloat((t3_paint - t0_start).toFixed(2)),
      };
      metricsRef.current = result;
      setMetrics(result);
      setStatus("done");
    }, 0);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  React.useEffect(() => {
    runBenchmark(debouncedValue);
  }, [debouncedValue, runBenchmark]);

  return (
    <>
      {/* OAT Core Styles */}
      <link rel="stylesheet" href="/oat/oat.min.css" />
      <script src="/oat/oat.min.js" defer />

      <main className="p-4 vstack" style={{ minHeight: "100vh" }}>
        <header>
          <h1>Track C: OAT — Pure CSS + Native Buttons</h1>
          <p className="text-light">
            OAT is a zero-dependency, ~8KB CSS + JS library. Buttons are plain <code>&lt;button&gt;</code> elements styled directly with CSS — no Shadow DOM, no Virtual DOM, no framework.
          </p>
        </header>

        <section className="hstack items-center gap-4 mb-6">
          <div className="vstack gap-1" style={{ flex: 1, maxWidth: "300px" }}>
            <label htmlFor="btn-label">Button Label</label>
            <input 
              id="btn-label"
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Enter text..."
            />
          </div>
          <button type="button" onClick={() => runBenchmark(inputValue)}>
            ↺ Re-run Benchmark
          </button>
        </section>

        <div id="oat-metrics">
          {status === "done" && metrics && (
            <div role="alert" data-variant="success" className="vstack">
              <h6 className="toast-title">OAT Native (n={TOTAL_BUTTONS}) in {metrics.total}ms</h6>
              <ul className="unstyled text-light">
                <li>• {metrics.render}ms — DOM insertion (Native)</li>
                <li>• 0ms — Hydration (Pure CSS)</li>
                <li>• {metrics.paint}ms — Layout & Paint</li>
              </ul>
            </div>
          )}
        </div>

        <hr />

        <section>
          <p className="text-lighter mb-2 small">
            ↓ {TOTAL_BUTTONS} OAT-styled native <code>&lt;button&gt;</code> elements
          </p>
          <div
            ref={containerRef}
            id="oat-button-container"
            className="hstack"
            style={{ gap: "0.5rem" }}
          />
        </section>
      </main>
    </>
  );
}
