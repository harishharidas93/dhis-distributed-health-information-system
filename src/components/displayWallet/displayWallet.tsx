export default function DisplayWallet({walletAddress}: { walletAddress: string | null }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            {!walletAddress &&
            walletAddress}
            
        </div>
    );
}
