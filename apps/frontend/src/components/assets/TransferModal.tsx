import { useState } from "react";
import type { Assets } from "@/api/nftApi.types";

type Asset = Assets[number];

type TransferModalProps = {
  asset: Asset;
  onClose: () => void;
  onTransfer: (assetId: string, toUserEmail: string) => Promise<void>;
};

export const TransferModal = ({
  asset,
  onClose,
  onTransfer,
}: TransferModalProps) => {
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
        <h3 className="text-lg font-bold mb-4">Transfer NFT: {asset.name}</h3>
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
