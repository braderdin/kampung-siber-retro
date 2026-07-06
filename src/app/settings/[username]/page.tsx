type SettingsPageProps = {
  params: Promise<{ username: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { username } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-semibold">Settings for {username}</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          This settings page is ready for future personalization options.
        </p>
      </div>
    </main>
  );
}
