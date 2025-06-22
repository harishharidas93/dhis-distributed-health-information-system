'use client';

const WalletConnectButton = () => {
    const handleGetStarted = () => {
        // Navigation logic here
        alert('Navigate to main app');
    };

  return (
    <button
        onClick={handleGetStarted}
        className="relative w-1/2 h-[20vh] min-h-[120px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-2xl md:text-3xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
    >
        {/* Button background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center h-full">
        <span className="mr-4">Connect Wallet</span>
        <svg className="w-8 h-8 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        </div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:animate-pulse"></div>
    </button>
  );
}

export default WalletConnectButton;

