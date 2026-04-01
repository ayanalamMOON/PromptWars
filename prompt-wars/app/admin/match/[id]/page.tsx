export default function AdminMatchPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-primary">
                Match Control — {params.id}
            </h1>
            <p className="mt-4 text-gray-600">Individual match control panel</p>
            {/* Match-level admin controls: override, re-judge, status */}
        </main>
    );
}
