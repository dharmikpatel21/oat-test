"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dropdown } from "@/components/Dropdown";
import { TableRow } from "@/components/TableRow";
import BenchmarkPanel, { BenchmarkMetrics } from "@/components/BenchmarkPanel";
import { getProductsData, deleteProductData, Product } from "@/lib/products";

// ─────────────────────────────────────────────
//  Configuration
// ─────────────────────────────────────────────
const COLUMNS = ["Index", "Name", "Brand", "Price", "Availability"];
const AVAILABILITY_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "in_stock", label: "In Stock" },
  { value: "limited_stock", label: "Limited Stock" },
  { value: "backorder", label: "Backorder" },
  { value: "discontinued", label: "Discontinued" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "pre_order", label: "Pre-Order" },
];

// ─────────────────────────────────────────────
//  Page Component
// ─────────────────────────────────────────────
export default function TableOatPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10000);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState("");

  const [metrics, setMetrics] = useState<BenchmarkMetrics>({
    load: null,
    render: null,
    hydration: null,
    interactive: null,
    total: null,
    rowCount: 10,
    runs: 0,
  });
  const [isRunning, setIsRunning] = useState(false);

  // ── Instrumentation Refs ────────────────────
  const startTimeRef = useRef<number>(0);
  const isBenchmarkingRef = useRef<boolean>(false);
  const [hydrationStart] = useState(() => performance.now());

  // ── Fetch Data ──────────────────────────────
  const fetchProducts = useCallback(
    async (p: number, l: number, q: string, f: string) => {
      setLoading(true);
      const filterStr = f ? `Availability = ${f}` : "";

      const { products: data, totalCount: total } = await getProductsData(
        p,
        l,
        q,
        filterStr,
      );

      // Start timing AFTER fetch — measures only React commit, not network
      startTimeRef.current = performance.now();
      isBenchmarkingRef.current = true;
      setIsRunning(true);

      setProducts(data);
      setTotalCount(total);
      setLoading(false);
    },
    [],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(page, limit, searchQuery, availability);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, limit, searchQuery, availability, fetchProducts]);

  // ── Auto-Benchmark Instrumentation ────────
  useLayoutEffect(() => {
    if (!isBenchmarkingRef.current) return;

    const t1 = performance.now(); // DOM update committed
    const renderTime = t1 - startTimeRef.current;

    // Measure interactive / paint
    requestAnimationFrame(() => {
      const t2 = performance.now();
      const interactiveTime = t2 - t1;

      setMetrics((m) => ({
        ...m,
        render: renderTime,
        interactive: interactiveTime,
        total: t2 - startTimeRef.current,
        rowCount: limit,
        runs: m.runs + 1,
        hydration: 0,
      }));
      
      isBenchmarkingRef.current = false;
      setIsRunning(false);
    });
  }, [products, limit]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setAvailability("");
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteProductData(id);
    if (success) {
      fetchProducts(page, limit, searchQuery, availability);
    }
  };

  // ── Capture page load timing ────────────────
  useEffect(() => {
    const capture = () => {
      const [nav] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (nav) {
        setMetrics((m) => ({ 
          ...m, 
          load: nav.domComplete - nav.startTime,
          hydration: performance.now() - hydrationStart,
        }));
      }
    };
    if (document.readyState === "complete") {
      capture();
    } else {
      window.addEventListener("load", capture, { once: true });
    }
  }, [hydrationStart]);

  return (
    <div
      className="container vstack"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-10)",
        gap: "var(--space-6)",
      }}
    >
      {/* ── Benchmark Panel ── */}
      <BenchmarkPanel
        trackName="Track 4 — OAT Components"
        trackDescription="Measures real-time performance of OAT semantic grid for each search/filter/delete operation."
        accentColor="#8b5cf6"
        accentBg="rgba(139,92,246,0.08)"
        accentBorder="rgba(139,92,246,0.25)"
        metrics={metrics}
        isRunning={isRunning}
        rowCount={limit}
        onRowCountChange={(n) => {
          setLimit(n);
          setPage(1);
        }}
        onRun={() => fetchProducts(page, limit, searchQuery, availability)}
        strategyBadge="OAT Semantic"
      />

      {/* ── Header ── */}
      <header className="vstack" style={{ gap: "var(--space-2)" }}>
        <h1>Track 4: OAT Components</h1>
        <p className="text-muted">
          Connected to MeiliSearch (port 7700) with 100k records.
        </p>
      </header>

      {/* Toolbar */}
      <article className="card" style={{ padding: "var(--space-4)" }}>
        <div className="flex !w-full gap-4">
          <Input
            label="Search Products"
            placeholder="Search by name, brand, or category..."
            value={searchQuery}
            onChange={(e: any) => {
              const val =
                e.detail?.value !== undefined
                  ? e.detail.value
                  : e.target?.value;
              setSearchQuery(val || "");
              setPage(1);
            }}
          />
          <Dropdown
            label="Availability"
            placeholder="All Statuses"
            value={availability}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setAvailability(e.target.value);
              setPage(1);
            }}
          >
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Dropdown>

          <Button variant="secondary" isOutline onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      </article>

      {/* Pagination */}
      <nav
        aria-label="Pagination"
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <p className="small text-muted">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} results
        </p>
        <menu className="buttons">
          <li>
            <Button
              variant="secondary"
              isSmall
              isOutline
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              &larr; Previous
            </Button>
          </li>
          <li>
            <Button
              variant="secondary"
              isSmall
              isOutline
              disabled={page * limit >= totalCount || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next &rarr;
            </Button>
          </li>
        </menu>
      </nav>

      {/* Table */}
      <div className="table card">
        <table style={{ minHeight: "400px", position: "relative" }}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.5)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <td
                  colSpan={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  Loading...
                </td>
              </tr>
            )}
            {products.map((prod) => (
              <TableRow
                key={prod.Index}
                rowId={prod.Index}
                columns={COLUMNS}
                rowData={prod}
              >
                <td style={{ textAlign: "right" }}>
                  <div
                    className="hstack"
                    style={{
                      justifyContent: "flex-end",
                      gap: "var(--space-2)",
                    }}
                  >
                    <Button
                      variant="danger"
                      isSmall
                      onClick={() => handleDelete(prod.Index)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
