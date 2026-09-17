import { Link } from "@tanstack/react-router";

export function KamazonLogo() {
  return (
    <Link to="/" className="amazon-logo" aria-label="Kamazon home">
      <span className="amazon-logo-k">k</span>
      <span>amazon</span>
      <i aria-hidden="true" />
    </Link>
  );
}
