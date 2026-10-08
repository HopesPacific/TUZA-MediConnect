import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/common/Button'
import { Calendar, Building2, Shield, Phone } from 'lucide-react'

/**
 * Public landing page — full design built in Phase 13 (UI refinement).
 * This version is clean, functional, and shows the platform concept clearly.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar transparent />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white">
        <div className="page-container py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Healthcare Digital Platform · Kenya
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your health, <br />connected and simplified.
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
              Tuza MediConnect connects patients with verified healthcare facilities.
              Book appointments, track your health, and communicate with your care team — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" variant="secondary"
                  className="bg-white text-primary-700 hover:bg-primary-50 border-0">
                  Book an Appointment
                </Button>
              </Link>
              <Link to="/facilities">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/40 hover:bg-white/10">
                  Find a Facility
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Getting healthcare has never been easier. Three steps and you're done.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Building2, title: 'Find a facility',   desc: 'Browse verified hospitals, clinics, and specialty centers near you.' },
              { step: '02', icon: Calendar,  title: 'Book appointment',  desc: 'Choose a service, pick a time, and submit your appointment request.' },
              { step: '03', icon: Phone,     title: 'Get confirmation',  desc: 'Receive real-time updates via in-app notification, email, or SMS.'   },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-primary-100">{step}</span>
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-primary-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete platform built for patients and healthcare providers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: '🏥', title: 'Multiple Facility Types',    desc: 'Hospitals, clinics, pharmacies, dental, labs, and more.' },
              { emoji: '📅', title: 'Smart Scheduling',          desc: 'Real-time availability, no double-booking, instant confirmation.' },
              { emoji: '🔔', title: 'Instant Notifications',     desc: 'SMS, email, and in-app alerts for every appointment update.' },
              { emoji: '💬', title: 'Direct Messaging',          desc: 'Communicate directly with healthcare facility staff.' },
              { emoji: '📋', title: 'Appointment History',       desc: 'Full medical appointment records, always accessible.' },
              { emoji: '🔒', title: 'Secure & Private',          desc: 'Your health data is protected with industry-standard security.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="card p-5 hover:shadow-card-md transition-shadow">
                <span className="text-2xl mb-3 block">{emoji}</span>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-700 text-white">
        <div className="page-container text-center">
          <Shield size={40} className="mx-auto mb-4 text-primary-300" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of patients connecting with quality healthcare facilities across Kenya.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 border-0">
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="page-container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Tuza MediConnect</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Tuza MediConnect. Portfolio project — not a real medical service.</p>
          <div className="flex gap-5 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
