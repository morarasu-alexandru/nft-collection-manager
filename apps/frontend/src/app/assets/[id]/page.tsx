"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { nftApi } from "@/api/nftApi";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AssetDetails } from "@/api/nftApi.types";

export default function AssetDetailsPage() {
  const { accessToken } = useAuth();
  const params = useParams();
  const assetId = params.id as string;
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (!assetId || !accessToken) return;

      try {
        setLoading(true);
        const assetData = await nftApi.getAssetDetails.query(assetId);
        setAsset(assetData);
      } catch (err) {
        setError("Failed to load asset details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [assetId, accessToken]);

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-red-500">{error || "Asset not found"}</div>
        <Link
          href="/assets"
          className="text-blue-500 hover:underline mt-4 block"
        >
          ← Back to Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/assets" className="text-blue-500 hover:underline">
          ← Back to Assets
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{asset.name}</h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Description:</p>
            <p className="text-gray-700">{asset.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Owner:</p>
            <p className="text-gray-700">{asset.owner}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created:</p>
            <p className="text-gray-700">
              {dayjs(asset.created_at).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Transfer History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {asset.transactions && asset.transactions.length === 0 ? (
            <p className="p-4 text-gray-500">No transfers yet</p>
          ) : (
            asset.transactions?.map((transfer) => (
              <div key={transfer.id} className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{transfer.fromUserId}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <span className="text-gray-600">{transfer.toUserId}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {dayjs(transfer.transactionDate).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
