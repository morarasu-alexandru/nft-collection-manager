export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          NFT Collection Manager
        </h1>

        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">
            Welcome to my NFT Collection Manager project. I developed this
            application as part of a job application process
          </p>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              This project showcases my ability to create modern web
              applications using:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>Fastify</li>
              <li>tRPC</li>
              <li>Supabase</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
