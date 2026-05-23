"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2 style={{ marginTop: 0 }}>Account is temporarily unavailable</h2>
        <p style={{ color: "var(--account-muted)" }}>
          Please retry. If this continues, check auth and environment settings.
        </p>
        <button className="signin-button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
