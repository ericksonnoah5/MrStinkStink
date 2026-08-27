export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-900 p-10 shadow-xl">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
}
