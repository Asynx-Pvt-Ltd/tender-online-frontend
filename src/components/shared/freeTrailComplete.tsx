import { useRouter } from "next/navigation";

interface FreeTrialCompleteProps {
  message?: string;
  buttonText?: string;
}

const FreeTrialComplete: React.FC<FreeTrialCompleteProps> = ({
  message = "Your free trial has ended. Please subscribe to continue.",
  buttonText = "Go to Pricing",
}) => {
  const navigate = useRouter();

  const handleNavigate = () => {
    navigate.push("/pricing"); // Adjust this path based on your actual pricing page route
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
      <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-3xl p-4 sm:p-6 text-white shadow-lg text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">{message}</h2>
        <button
          onClick={handleNavigate}
          className="mt-4 bg-white text-red-600 hover:bg-gray-200 font-bold py-2 px-4 sm:px-6 rounded-full transition-all duration-300 ease-in-out"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FreeTrialComplete;
