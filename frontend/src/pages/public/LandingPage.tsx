import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/common/Button'
import {
  Calendar, Building2, Shield, Phone, CheckCircle,
  Star, ArrowRight, ChevronDown, ChevronUp,
  Stethoscope, Bell, MessageSquare, CreditCard
} from 'lucide-react'

// ── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '4+',   label: 'Healthcare Facilities'     },
  { value: '18+',  label: 'Services Available'        },
  { value: '100%', label: 'Verified by Tuza Team'     },
  { value: '24/7', label: 'Platform Availability'     },
]

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { emoji: '🩺', label: 'General Consultation' },
  { emoji: '🦷', label: 'Dental Care'          },
  { emoji: '🔬', label: 'Laboratory Tests'     },
  { emoji: '🤱', label: 'Maternal Health'      },
  { emoji: '👶', label: 'Child Health'         },
  { emoji: '🧠', label: 'Mental Health'        },
  { emoji: '💉', label: 'Vaccination'          },
  { emoji: '💊', label: 'Pharmacy'             },
]

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Calendar size={22} />,
    title:  'Smart Appointment Booking',
    desc:   'Select a facility, choose a service, pick an available time slot — done in under 2 minutes.',
    color:  'bg-blue-100 text-blue-600',
  },
  {
    icon: <Bell size={22} />,
    title:  'Real-time Notifications',
    desc:   'Instant alerts via in-app notifications, email, and SMS when your appointment status changes.',
    color:  'bg-yellow-100 text-yellow-600',
  },
  {
    icon: <MessageSquare size={22} />,
    title:  'Direct Messaging',
    desc:   'Communicate directly with your healthcare provider before and after appointments.',
    color:  'bg-green-100 text-green-600',
  },
  {
    icon: <CreditCard size={22} />,
    title:  'MTN Mobile Money',
    desc:   'Pay for healthcare services securely using MTN Mobile Money or other payment options.',
    color:  'bg-purple-100 text-purple-600',
  },
  {
    icon: <Shield size={22} />,
    title:  'Verified Facilities',
    desc:   'Every facility on the platform is verified by the Tuza MediConnect team for quality.',
    color:  'bg-teal-100 text-teal-600',
  },
  {
    icon: <Stethoscope size={22} />,
    title:  'Full Appointment History',
    desc:   'Access your complete appointment records and health interaction history anytime.',
    color:  'bg-red-100 text-red-600',
  },
]

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Is Tuza MediConnect free to use?',
    a: 'Registration and browsing are completely free. You only pay when you receive healthcare services — the platform itself charges no booking fees.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Create a free account, browse healthcare facilities, select a service and available time slot, then submit your appointment request. You\'ll receive a confirmation notification.',
  },
  {
    q: 'Can I cancel an appointment?',
    a: 'Yes. You can cancel any pending or confirmed appointment from your dashboard. Please cancel at least 24 hours before your scheduled time as a courtesy.',
  },
  {
    q: 'How does MTN Mobile Money payment work?',
    a: 'After confirming your appointment, you can initiate payment. A request is sent to your MTN number — simply approve it on your phone by entering your MTN MoMo PIN.',
  },
  {
    q: 'What if a facility rejects my appointment?',
    a: 'You will be notified immediately by SMS and in-app notification with the reason. You can then rebook at a different time or facility.',
  },
  {
    q: 'Is my health data secure?',
    a: 'All data is encrypted in transit and at rest. We follow industry-standard security practices. We never share your health information without your explicit consent.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
               : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar transparent />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-teal-700 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
        </div>

        <div className="page-container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Platform operational · Kenya
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Healthcare, simplified<br />
              <span className="text-teal-300">for every Kenyan.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-2xl">
              Connect with verified healthcare facilities, book appointments in minutes,
              pay with MTN Mobile Money, and manage your entire healthcare journey — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/register">
                <Button size="lg"
                  className="bg-white text-primary-800 hover:bg-primary-50 border-0 shadow-lg font-semibold">
                  Book an Appointment
                  <ArrowRight size={18} className="ml-1" />
                </Button>
              </Link>
              <Link to="/facilities">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10">
                  Find a Facility
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4">
              {['Free to register', 'No booking fees', 'MTN MoMo payments'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-white/80">
                  <CheckCircle size={14} className="text-green-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary-400 mb-1">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm mb-2">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book a visit in 3 steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Getting healthcare has never been easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-primary-200" />

            {[
              { step: '01', icon: Building2, title: 'Find a facility', desc: 'Browse verified hospitals, clinics, pharmacies, and specialty centers near you.', color: 'bg-primary-600' },
              { step: '02', icon: Calendar,  title: 'Book a slot',     desc: 'Choose a service, pick a convenient date and time, submit your request.',         color: 'bg-teal-600'    },
              { step: '03', icon: Phone,     title: 'Get confirmed',   desc: 'Receive instant confirmation via SMS and in-app notification. Pay with MTN MoMo.', color: 'bg-primary-800' },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="relative text-center">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <Icon size={28} className="text-white" />
                </div>
                <span className="absolute top-0 right-1/2 translate-x-8 -translate-y-1 text-5xl font-black text-gray-100 select-none">
                  {step}
                </span>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ─────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm mb-2">What we offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Healthcare services for every need
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {SERVICES.map(s => (
              <Link key={s.label} to="/services"
                className="card p-5 text-center hover:shadow-card-md hover:border-primary-200 border border-transparent transition-all group">
                <span className="text-3xl block mb-3">{s.emoji}</span>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors">
                  {s.label}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/services">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                View all services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm mb-2">Platform features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need, in one platform
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-card-md transition-shadow">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Patients vs Providers ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Patients */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">For Patients</h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Browse & book appointments 24/7',
                  'Real-time appointment status updates',
                  'Pay securely with MTN Mobile Money',
                  'Access full appointment history',
                  'Direct messaging with your care team',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle size={16} className="text-teal-300 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="bg-white text-primary-700 hover:bg-primary-50 border-0">
                  Create patient account
                </Button>
              </Link>
            </div>

            {/* Providers */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">For Healthcare Providers</h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Manage your facility profile & services',
                  'Confirm, reject, or reschedule appointments',
                  'View today\'s schedule at a glance',
                  'Communicate with patients directly',
                  'Track appointment completion rates',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle size={16} className="text-teal-300 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="mailto:admin@tuzamediconnect.com">
                <Button className="bg-white text-teal-700 hover:bg-teal-50 border-0">
                  Register your facility
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm mb-2">Got questions?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary-700 text-white">
        <div className="page-container text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to access better healthcare?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of Kenyans connecting with quality healthcare facilities through Tuza MediConnect.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 border-0 shadow-lg font-semibold">
                  Create free account
                </Button>
              </Link>
              <Link to="/facilities">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10">
                  Browse facilities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-bold text-white">Tuza MediConnect</span>
              </div>
              <p className="text-sm leading-relaxed">
                Connecting patients with healthcare facilities across Kenya.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/facilities" className="hover:text-white transition-colors">Find Facilities</Link></li>
                <li><Link to="/services"   className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/register"   className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link to="/login"      className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* For Providers */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">For Providers</p>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:admin@tuzamediconnect.com" className="hover:text-white transition-colors">Register Facility</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Contact</p>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@tuzamediconnect.com" className="hover:text-white transition-colors">support@tuzamediconnect.com</a></li>
                <li className="text-gray-500">Portfolio Project — Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} Tuza MediConnect. Portfolio project — not a real medical service.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
