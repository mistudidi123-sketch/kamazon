import { Link } from "@tanstack/react-router";

export function KamazonLogo() {
  return (
    <Link to="/" className="amazon-logo" aria-label="Kamazon home">
      <span className="amazon-logo-word">
        <span className="amazon-logo-k">k</span>
        <span>amazon</span>
      </span>
      <svg
        className="amazon-logo-smile"
        viewBox="0 0 100 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 4.2C16.5 12.4 34 15.4 50.5 15.4c15.2 0 30.2-2.8 43.2-9.2"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path d="M99.4 1.1 86.6 4.9l8.3 6.6z" fill="currentColor" />
      </svg>
    </Link>
  );
}
