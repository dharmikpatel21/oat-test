"use client";

import React from "react";

export interface BenchmarkMetrics {
  load: number | null;
  render: number | null;
  hydration: number | null;
  interactive: number | null;
  total: number | null;
  rowCount: number;
  runs: number;
}

interface MetricCardProps {
  label: string;
  value: number | null;
  description: string;
  accent: string;
  accentBg: string;
}

function MetricCard({ label, value, description, accent, accentBg }: MetricCardProps) {
  const ready = value !== null;
  return (
    <div
      style={{
        background: ready ? accentBg : "rgba(255,255,255,0.03)",
        border: `1px solid ${ready ? accent + "40" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {ready && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          }}
        />
      )}
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: ready ? accent : "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: ready ? "#f8fafc" : "rgba(255,255,255,0.12)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            transition: "color 0.3s ease",
          }}
        >
          {ready ? value!.toFixed(2) : "—"}
        </span>
        {ready && (
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>ms</span>
        )}
      </div>
      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>
        {description}
      </span>
    </div>
  );
}

interface BenchmarkPanelProps {
  trackName: string;
  trackDescription: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  metrics: BenchmarkMetrics;
  isRunning: boolean;
  rowCount: number;
  onRowCountChange: (n: number) => void;
  onRun: () => void;
  strategyBadge?: string;
  /** Label for the count (default: "rows") */
  itemLabel?: string;
}

export default function BenchmarkPanel({
  trackName,
  trackDescription,
  accentColor,
  accentBg,
  accentBorder,
  metrics,
  isRunning,
  rowCount,
  onRowCountChange,
  onRun,
  strategyBadge,
  itemLabel = "rows",
}: BenchmarkPanelProps) {
  const hasResults = metrics.total !== null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        border: `1px solid ${accentBorder}`,
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "var(--space-8)",
        boxShadow: `0 0 40px ${accentColor}15, 0 4px 24px rgba(0,0,0,0.4)`,
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* background glow */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: hasResults ? accentColor : isRunning ? "#fbbf24" : "rgba(255,255,255,0.2)",
                boxShadow: hasResults ? `0 0 8px ${accentColor}` : isRunning ? "0 0 8px #fbbf24" : "none",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accentColor,
              }}
            >
              ⚡ Benchmark Panel
            </span>
            {strategyBadge && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.06)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {strategyBadge}
              </span>
            )}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
            {trackName}
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", margin: 0, maxWidth: "500px" }}>
            {trackDescription}
          </p>
        </div>

        {hasResults && (
          <div
            style={{
              background: accentBg,
              border: `1px solid ${accentBorder}`,
              borderRadius: "12px",
              padding: "12px 20px",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, marginBottom: "4px" }}>
              Total Time
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#f8fafc", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {metrics.total!.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.42)", marginTop: "2px" }}>
              ms · {metrics.rowCount} {itemLabel} · run #{metrics.runs}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <MetricCard label="Page Load" value={metrics.load} description="Navigation start → DOM complete (Nav Timing API)" accent={accentColor} accentBg={accentBg} />
        <MetricCard label="Render" value={metrics.render} description="React JSX processing & synchronous DOM construction" accent={accentColor} accentBg={accentBg} />
        <MetricCard label="Hydration" value={metrics.hydration} description="Shadow DOM / custom element upgrade to ready state" accent={accentColor} accentBg={accentBg} />
        <MetricCard label="Interactive" value={metrics.interactive} description="Layout, browser paint & time to user interaction" accent={accentColor} accentBg={accentBg} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <label
            htmlFor="oat-row-count"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600, whiteSpace: "nowrap" }}
          >
            {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} to render:
          </label>
          <input
            id="oat-row-count"
            type="number"
            min={10}
            max={5000}
            step={10}
            value={rowCount}
            onChange={(e) => onRowCountChange(Math.max(10, Math.min(5000, Number(e.target.value))))}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f8fafc",
              fontSize: "14px",
              fontWeight: 700,
              width: "70px",
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </div>

        <button
          id="oat-run-benchmark-btn"
          onClick={onRun}
          disabled={isRunning}
          style={{
            background: isRunning ? "rgba(255,255,255,0.04)" : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            border: `1px solid ${isRunning ? "rgba(255,255,255,0.08)" : accentColor}`,
            borderRadius: "10px",
            padding: "10px 24px",
            color: isRunning ? "rgba(255,255,255,0.25)" : "#fff",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: isRunning ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: isRunning ? "none" : `0 4px 16px ${accentColor}40`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isRunning ? "Running…" : "▶ Run Benchmark"}
        </button>

        {hasResults && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {[
              { label: "Render", pct: metrics.render !== null && metrics.total !== null ? ((metrics.render / metrics.total) * 100).toFixed(0) : "—" },
              { label: "Hydration", pct: metrics.hydration !== null && metrics.total !== null ? ((metrics.hydration / metrics.total) * 100).toFixed(0) : "—" },
              { label: "Paint", pct: metrics.interactive !== null && metrics.total !== null ? ((metrics.interactive / metrics.total) * 100).toFixed(0) : "—" },
            ].map((item) => (
              <span
                key={item.label}
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.42)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  padding: "4px 10px",
                }}
              >
                {item.label}: <strong style={{ color: "rgba(255,255,255,0.65)" }}>{item.pct}%</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
