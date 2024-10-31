type HamburgerButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
  >
    <span className="sr-only">Open main menu</span>
    {!isOpen ? (
      <svg
        className="block h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ) : (
      <svg
        className="block h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
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
    )}
  </button>
);
