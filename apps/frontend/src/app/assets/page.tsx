"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { nftApi } from "@/api/nftApi";
import type {
  Assets,
  AddAssetInput,
  TransferAssetInput,
} from "@/api/nftApi.types";
import { toast } from "react-toastify";
import { AssetCard } from "@/components/assets/AssetCard";
import { AddAssetModal } from "@/components/assets/AddAssetModal";
import { FilterSort } from "@/components/assets/FilterSort";
import { TransferModal } from "@/components/assets/TransferModal";

type Asset = Assets[number];

export default function AssetsPage() {
  const { accessToken, userId } = useAuth();
  const [assets, setAssets] = useState<Assets>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [newAsset, setNewAsset] = useState<Omit<AddAssetInput, "ownerId">>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    if (!userId || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      const responseData = await nftApi.getAssets.query(userId);
      setAssets(responseData);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
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
      toast.success("Asset added successfully!");
      fetchAssets();
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset");
    }
  };

  const handleTransfer = async (assetId: string, toUserEmail: string) => {
    if (!userId || !accessToken) return;

    try {
      const transferInput: TransferAssetInput = {
        assetId,
        fromUserId: userId,
        toUserEmail,
      };
      await nftApi.transferAsset.mutate(transferInput);

      toast.success("NFT transferred successfully!");
      await fetchAssets();
    } catch (error: any) {
      console.error("Error transferring asset:", error);
      toast.error("Failed to transfer NFT");
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

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <p className="text-gray-700 font-medium">Loading assets...</p>
      </div>
    );
  }

  if (!userId || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please login to view assets</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My NFT tokens</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add New NFT
        </button>
      </div>

      <FilterSort
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onTransfer={(asset) => setSelectedAsset(asset)}
          />
        ))}
      </div>

      {showAddForm && (
        <AddAssetModal
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddAsset}
          newAsset={newAsset}
          setNewAsset={setNewAsset}
        />
      )}

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
