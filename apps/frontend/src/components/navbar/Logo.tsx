import Link from "next/link";
import { pageUrl } from "@/config/pageUrl";

export const Logo = () => (
  <Link
    href={pageUrl.home}
    className="flex items-center space-x-2 text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors"
  >
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
    <span className="text-xl font-bold tracking-wide">NFT Collection</span>
  </Link>
);
