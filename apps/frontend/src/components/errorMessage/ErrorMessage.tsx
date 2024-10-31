export const ErrorMessage = ({ message }: { message: string | undefined }) => (
  <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md mt-1">
    {message}
  </p>
);
