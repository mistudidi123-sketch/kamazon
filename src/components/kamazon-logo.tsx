import { Link } from "@tanstack/react-router";
import smile from "@/assets/kamazon-smile.png.asset.json";

export function KamazonLogo() {
  return (
    <Link to="/" className="amazon-logo" aria-label="Kamazon home">
      <span className="amazon-logo-k">k</span>
      <span>amazon</span>
      <img src={smile.url} alt="" aria-hidden="true" />
    </Link>
  );
}
