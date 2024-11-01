import Link from "next/link";
import dayjs from "dayjs";
import { Assets } from "@/api/nftApi.types";

type Asset = Assets[number];

interface AssetCardProps {
  asset: Asset;
  onTransfer: (asset: Asset) => void;
}

export const AssetCard = ({ asset, onTransfer }: AssetCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-3">{asset.name}</h3>
      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Description:</p>
          <p className="text-gray-700">{asset.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Created:</p>
          <p className="text-gray-600">
            {dayjs(asset.created_at).format("MMM D, YYYY h:mm A")}
          </p>
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <Link
          href={`/assets/${asset.id}`}
          className="block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors w-full text-center"
        >
          View Details
        </Link>
        <button
          onClick={() => onTransfer(asset)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors w-full"
        >
          Transfer NFT
        </button>
      </div>
    </div>
  );
};
