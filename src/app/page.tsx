import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#171717' }}>OAT Performance Test</h1>
      <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Testing zero-dependency pure CSS + native components.</p>
      
      <Link 
        href="/perf-oat"
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#574747',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'transform 0.2s',
        }}
      >
        Go to OAT Benchmark
      </Link>
    </div>
  );
}
