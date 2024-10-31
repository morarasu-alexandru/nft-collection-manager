// src/app/assets/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import { nftApi } from "@/api/nftApi";

type Asset = {
  id: string;
  name: string;
  description: string;
  owner: string;
  created_at: string;
};

type TransferModalProps = {
  asset: Asset;
  onClose: () => void;
  onTransfer: (assetId: string, toUserId: string) => Promise<void>;
};

const TransferModal = ({ asset, onClose, onTransfer }: TransferModalProps) => {
  const [toUserEmail, setToUserEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await onTransfer(asset.id, toUserEmail);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to transfer asset");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Transfer Asset: {asset.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={toUserEmail}
              onChange={(e) => setToUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="recipient@example.com"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AssetsPage() {
  const { accessToken, userId } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [newAsset, setNewAsset] = useState({
    name: "",
    description: "",
  });

  const openAddAssetModal = () => {
    setShowAddForm(true);
  };

  const closeAddAssetModal = () => {
    setShowAddForm(false);
  };

  const fetchAssets = async () => {
    if (!userId || !accessToken) return;

    try {
      const responseData = await nftApi.getAssets.query(userId);
      setAssets(responseData);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [userId, accessToken]);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !accessToken) return;

    try {
      await nftApi.addAsset.mutate({
        name: newAsset.name,
        description: newAsset.description,
        ownerId: userId,
      });

      setNewAsset({ name: "", description: "" });
      setShowAddForm(false);
      fetchAssets();
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const handleTransfer = async (assetId: string, toUserEmail: string) => {
    if (!userId || !accessToken) return;

    try {
      await nftApi.transferAsset.mutate({
        assetId,
        fromUserId: userId,
        toUserEmail,
      });

      await fetchAssets();
    } catch (error: any) {
      console.error("Error transferring asset:", error);
      throw new Error(
        error.response?.data?.message || "Failed to transfer asset",
      );
    }
  };

  const filteredAndSortedAssets = assets
    .filter((asset) =>
      asset.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (!userId || !accessToken) {
    return (
      <div className="p-4">
        <p>Please login to view assets</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My NFT tokens</h1>
        <button
          onClick={openAddAssetModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add New Asset
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Name
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search assets..."
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Asset Form */}
      {showAddForm && (
        <div
          onClick={closeAddAssetModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 cursor-default"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Add New Asset</h2>
              <button
                onClick={closeAddAssetModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newAsset.description}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedAssets.map((asset) => (
          <div
            key={asset.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-3">{asset.name}</h3>
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Description:
                </p>
                <p className="text-gray-700">{asset.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created:</p>
                <p className="text-gray-600">
                  {dayjs(asset.created_at).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedAsset(asset)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors w-full"
              >
                Transfer Asset
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Modal */}
      {selectedAsset && (
        <TransferModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
}
