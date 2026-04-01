export default function StationPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-primary">
                Station {params.id}
            </h1>
            <p className="mt-4 text-gray-600">Awaiting assignment</p>
            {/* Station session check and player assignment will be implemented here */}
        </main>
    );
}
