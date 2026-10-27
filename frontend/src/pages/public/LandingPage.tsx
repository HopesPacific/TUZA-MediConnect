import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Building2, Shield, Phone, Star, CheckCircle,
  ArrowRight, Users, Stethoscope, Heart, Brain, Baby,
  Clock, MapPin, ChevronDown, ChevronUp, Search
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '4+',   label: 'Healthcare Facilities' },
  { value: '18+',  label: 'Services Available'    },
  { value: '100%', label: 'Verified Providers'    },
  { value: '24/7', label: 'Platform Access'       },
]

const HOW_IT_WORKS = [
  { step: '01', icon: Search,    title: 'Find a Facility',   desc: 'Browse verified hospitals, clinics, and specialty centers near you. Filter by location, type, or service.' },
  { step: '02', icon: Calendar,  title: 'Book Appointment',  desc: 'Select a service, choose a convenient date and time, and describe the reason for your visit.'             },
  { step: '03', icon: Phone,     title: 'Get Confirmed',     desc: 'Receive real-time updates via in-app notification, email, or SMS when your appointment is confirmed.'        },
]

const SERVICES = [
  { icon: Stethoscope, name: 'General Consultation', color: 'bg-blue-100 text-blue-600'     },
  { icon: Heart,       name: 'Maternal Health',       color: 'bg-pink-100 text-pink-600'     },
  { icon: Brain,       name: 'Mental Health',         color: 'bg-purple-100 text-purple-600' },
  { icon: Baby,        name: 'Child Health',          color: 'bg-green-100 text-green-600'   },
  { icon: Shield,      name: 'Emergency Services',    color: 'bg-red-100 text-red-600'       },
  { icon: Building2,   name: 'Laboratory Services',   color: 'bg-yellow-100 text-yellow-600' },
]

const PATIENT_BENEFITS = [
  'Book appointments in under 2 minutes',
  'Real-time appointment status updates',
  'Access your full appointment history',
  'Direct messaging with your care team',
  'SMS and email reminders',
  'Secure payment via MTN Mobile Money',
]

const PROVIDER_BENEFITS = [
  'Manage all appointments in one place',
  'Reduce no-shows with automated reminders',
  'Accept or reject requests with one click',
  'View patient appointment summaries',
  'Track facility performance metrics',
  'Communicate directly with patients',
]

const FAQS = [
  { q: 'Is Tuza MediConnect free to use for patients?', a: 'Yes. Creating a patient account and browsing facilities is completely free. Some facilities may charge consultation fees payable at the facility or via MTN Mobile Money.' },
  { q: 'How do I know if a facility is reliable?', a: 'Facilities with a blue verified badge have been reviewed and approved by our team. Patient ratings and reviews are also visible on each facility page.' },
  { q: 'Can I cancel an appointment?', a: 'Yes. You can cancel a pending or confirmed appointment from your dashboard or the appointment detail page, as long as the facility has not yet marked it as completed.' },
  { q: 'How does MTN Mobile Money payment work?', a: 'When you select MTN MoMo as your payment method, a payment request is sent to your MTN number. You approve it by entering your MTN PIN on your phone — no card needed.' },
  { q: 'Is my health information secure?', a: 'Yes. All data is encrypted in transit and at rest. We follow healthcare data security best practices and never share your information without consent.' },
  { q: 'How do I register my facility?', a: 'Healthcare providers can contact us via the form on this page. Our team will review your facility and guide you through the onboarding process.' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar transparent />

      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <ServicesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-teal-600 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      <div className="page-container relative py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Platform live — serving patients across Kenya & Uganda
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your health,<br />
              <span className="text-teal-300">connected</span> and simplified.
            </h1>

            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
              Tuza MediConnect connects patients with verified healthcare facilities.
              Book appointments, track your health, and pay via MTN Mobile Money — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/register">
                <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg">
                  <Calendar size={18} /> Book an Appointment
                </button>
              </Link>
              <Link to="/facilities">
                <button className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Search size={18} /> Find a Facility
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Free to register</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> MTN MoMo payments</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Verified facilities</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-80 h-96">
              {/* Mock app card */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60">Upcoming</p>
                    <p className="font-semibold text-white">Appointment</p>
                  </div>
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-400" />
                  </div>
                </div>
                {[
                  { icon: '🏥', label: 'Nairobi Family Clinic',  sub: 'General Consultation' },
                  { icon: '📅', label: 'Tomorrow, 10:00 AM',     sub: 'Confirmed'             },
                  { icon: '💊', label: 'Service: KES 1,200',     sub: 'MTN MoMo available'    },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-white/60">{item.sub}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-auto p-3 bg-teal-500/30 rounded-xl border border-teal-400/30">
                  <p className="text-xs text-teal-300 font-medium text-center">✓ SMS reminder sent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-10 bg-gray-900 text-white">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary-400">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="section-padding">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Simple process</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">How Tuza MediConnect works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting quality healthcare has never been easier. Three steps to your appointment.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="relative">
              <div className="card p-6 h-full hover:shadow-card-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-black text-gray-100">{step}</span>
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Icon size={22} className="text-primary-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Healthcare services</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Comprehensive care in one platform</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From general consultations to specialized care — book across 18+ service categories.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {SERVICES.map(({ icon: Icon, name, color }) => (
            <div key={name} className="card p-4 text-center hover:shadow-card-md transition-shadow cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={22} />
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{name}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/services"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm">
            View all 18+ services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section className="section-padding">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Why choose us</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Built for everyone in healthcare</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Patients */}
          <div className="card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">For Patients</h3>
            </div>
            <div className="space-y-3">
              {PATIENT_BENEFITS.map(b => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{b}</span>
                </div>
              ))}
            </div>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
              Create free account <ArrowRight size={15} />
            </Link>
          </div>

          {/* Providers */}
          <div className="card p-7 border-primary-200 bg-primary-50/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">For Healthcare Providers</h3>
            </div>
            <div className="space-y-3">
              {PROVIDER_BENEFITS.map(b => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{b}</span>
                </div>
              ))}
            </div>
            <a href="mailto:facilities@tuzamediconnect.com"
              className="mt-6 inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
              Register your facility <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'Grace W.', role: 'Patient, Nairobi', text: 'I booked a dental appointment in less than 2 minutes. The confirmation SMS arrived instantly. This is exactly what Kenya needs.' },
    { name: 'Dr. James O.', role: 'General Practitioner', text: 'Managing our clinic appointments used to be chaotic. Tuza MediConnect has cut our no-show rate significantly.' },
    { name: 'Peter M.', role: 'Patient, Kisumu', text: 'The MTN MoMo payment is seamless. I paid for my lab test right from my phone without visiting a bank.' },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Testimonials</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Trusted by patients and providers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 text-sm font-semibold">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section-padding">
      <div className="page-container max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
          <p className="text-gray-500">Everything you need to know about Tuza MediConnect.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} className="text-primary-600 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary-700 to-teal-600 text-white">
      <div className="page-container text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Heart size={28} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
          Join thousands of patients and healthcare providers using Tuza MediConnect across Kenya and Uganda.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/register">
            <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg">
              <Calendar size={18} /> Book an Appointment
            </button>
          </Link>
          <Link to="/login">
            <button className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors">
              Sign in to your account
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-bold text-white">Tuza MediConnect</span>
            </div>
            <p className="text-xs leading-relaxed">
              Connecting patients with quality healthcare facilities across East Africa.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register" className="hover:text-white transition-colors">Create account</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition-colors">Find facilities</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign in</Link></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Providers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Register facility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Staff portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API documentation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><MapPin size={11} /> Nairobi, Kenya</li>
              <li><a href="mailto:support@tuzamediconnect.com" className="hover:text-white transition-colors">support@tuzamediconnect.com</a></li>
              <li><a href="tel:+254700000000" className="hover:text-white transition-colors">+254 700 000 000</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs">© {new Date().getFullYear()} Tuza MediConnect. Portfolio project — not a real medical service.</p>
          <div className="flex gap-5 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
