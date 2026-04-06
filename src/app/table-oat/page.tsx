"use client";

import React from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dropdown } from "@/components/Dropdown";
import { TableRow } from "@/components/TableRow";

const MOCK_DATA = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
  },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Admin" },
  { id: "5", name: "Ethan Hunt", email: "ethan@example.com", role: "Editor" },
  {
    id: "6",
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    role: "Viewer",
  },
  {
    id: "7",
    name: "George Miller",
    email: "george@example.com",
    role: "Admin",
  },
  {
    id: "8",
    name: "Hannah Abbott",
    email: "hannah@example.com",
    role: "Editor",
  },
  { id: "9", name: "Ian Wright", email: "ian@example.com", role: "Viewer" },
  { id: "10", name: "Jane Doe", email: "jane@example.com", role: "Admin" },
];

const COLUMNS = ["name", "email", "role"];

export default function TableOatPage() {
  return (
    <div
      className="container vstack"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-10)",
        gap: "var(--space-6)",
      }}
    >
      <header className="vstack" style={{ gap: "var(--space-2)" }}>
        <h1>Track 4: OAT Components</h1>
        <p className="text-muted">
          A high-performance Table UI built using OAT&apos;s semantic-first
          approach with zero-dependency CSS.
        </p>
      </header>

      {/* Toolbar - Using OAT Card and Grid */}
      <article className="card" style={{ padding: "var(--space-4)" }}>
        <div className="flex !w-full gap-4">
          <Input
            label="Search Users"
            placeholder="Search by name or email..."
            className={"w-full flex-1"}
          />
          <Dropdown label="Role Filter" placeholder="All Roles">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </Dropdown>

          <Button variant="secondary" isOutline>
            Clear Filters
          </Button>
        </div>
      </article>

      {/* Table - Using OAT Responsive Wrapper */}
      <div className="table card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((user) => (
              <TableRow
                key={user.id}
                rowId={user.id}
                columns={COLUMNS}
                rowData={user}
              >
                <td style={{ textAlign: "right" }}>
                  <div
                    className="hstack"
                    style={{
                      justifyContent: "flex-end",
                      gap: "var(--space-2)",
                    }}
                  >
                    <Button variant="danger" isSmall>
                      Delete
                    </Button>
                  </div>
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Reuse Button menu pattern */}
      <nav
        aria-label="Pagination"
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <p className="small text-muted">Showing 1 to 10 of 10 results</p>
        <menu className="buttons">
          <li>
            <Button variant="secondary" isSmall isOutline disabled>
              &larr; Previous
            </Button>
          </li>
          <li>
            <Button variant="secondary" isSmall isOutline disabled>
              Next &rarr;
            </Button>
          </li>
        </menu>
      </nav>
    </div>
  );
}
