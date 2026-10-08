/**
 * Public landing page — built fully in Phase 13 (UI refinement).
 * For now this is a clean placeholder that shows the brand and navigation works.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-teal-600 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <div className="mb-6">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Healthcare Digital Platform
          </span>
          <h1 className="text-5xl font-bold mb-4">Tuza MediConnect</h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto">
            Connecting patients with healthcare facilities — making healthcare easier to access.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <a
            href="/register"
            className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Book an Appointment
          </a>
          <a
            href="/login"
            className="bg-white/20 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
          >
            Sign In
          </a>
        </div>
        <p className="mt-8 text-white/60 text-sm">
          Full landing page coming in Phase 13 · UI Refinement
        </p>
      </div>
    </div>
  )
}
