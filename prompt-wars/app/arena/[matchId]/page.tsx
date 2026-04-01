export default function ArenaPage({
    params,
}: {
    params: { matchId: string };
}) {
    return (
        <main className="min-h-screen p-4">
            <h1 className="text-2xl font-bold text-primary">
                Battle Room — Match {params.matchId}
            </h1>
            {/* BattleRoom component: editor, timer, output viewer, verdict overlay */}
        </main>
    );
}
