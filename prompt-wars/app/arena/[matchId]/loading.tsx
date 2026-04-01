export default function ArenaLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <span className="ml-4 text-gray-600">Loading Battle Room...</span>
        </div>
    );
}
