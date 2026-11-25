import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Building2, Shield, Phone, Star, CheckCircle,
  ArrowRight, Users, Stethoscope, Heart, Brain, Baby,
  Clock, MapPin, ChevronDown, ChevronUp, Search
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

const STATS = [
  { value: '4+',   label: 'Healthcare Facilities' },
  { value: '18+',  label: 'Services Available'    },
  { value: '100%', label: 'Verified Providers'    },
  { value: '24/7', label: 'Platform Access'       },
]

const HOW_IT_WORKS = [
  { step: '01', icon: Search,   title: 'Shakisha Ivuriro',   desc: 'Shakisha ibitaro, klinike, na ivuriro ryose ryemewe hafi yawe. Shungura inzu yifuza ukoresheje ahantu, ubwoko, cyangwa serivisi.' },
  { step: '02', icon: Calendar, title: 'Gufata Appointment', desc: 'Hitamo serivisi, hitamo itariki na saa ubonye, kandi sobanura impamvu y\'isura ryawe.' },
  { step: '03', icon: Phone,    title: 'Kubona Kwemezwa',    desc: 'Kubona amakuru y\'igihe nyacyo binyuze mu butumwa bw\'imbere, imeyili, cyangwa SMS iyo appointment yawe yemejwe.' },
]

const SERVICES = [
  { icon: Stethoscope, name: 'Isura Rusange',       color: 'bg-blue-100 text-blue-600'     },
  { icon: Heart,       name: 'Ubuzima bw\'Inda',    color: 'bg-pink-100 text-pink-600'     },
  { icon: Brain,       name: 'Ubuzima bw\'Ingenge', color: 'bg-purple-100 text-purple-600' },
  { icon: Baby,        name: 'Ubuzima bw\'Abana',   color: 'bg-green-100 text-green-600'   },
  { icon: Shield,      name: 'Serivisi z\'Ihutiro', color: 'bg-red-100 text-red-600'       },
  { icon: Building2,   name: 'Laboratwari',          color: 'bg-yellow-100 text-yellow-600' },
]

const PATIENT_BENEFITS = [
  'Fata appointment mu minota ibiri',
  'Amakuru y\'igihe nyacyo kuri appointment yawe',
  'Reba amateka yawe yose ya appointment',
  'Vugana na muganga wawe kuri serivisi',
  'Ibibutsa bya SMS na imeyili',
  'Kwishyura binyuze kuri MTN Mobile Money',
]

const PROVIDER_BENEFITS = [
  'Gucunga appointment zose ahantu hamwe',
  'Kugabanya abatagera binyuze ku bibutsa by\'iyibutsa',
  'Kwemeza cyangwa guta ibisabwa kanda rimwe',
  'Reba incamake ya appointment z\'abarwayi',
  'Gukurikirana imikorere y\'ivuriro ryawe',
  'Vugana na barwayi neza',
]

const FAQS = [
  {
    q: 'Tuza MediConnect irishyurwa n\'abarwayi?',
    a: 'Yego. Gukora konti y\'umurwayi no gusesengura ivuriro birangwa ubuntu rwose. Ivuriro rimwe na rimwe rirashobora gufata amafaranga yo gusura bisharwa mu ivuriro cyangwa binyuze kuri MTN Mobile Money.',
  },
  {
    q: 'Nzamenya gute ko ivuriro rifatwa neza?',
    a: 'Ivuriro ifite badge yo ku buryo bwa bluu yemejwe ryasuzumwe kandi rwemejwe n\'itsinda ryacu. Ibipimo n\'ibitekerezo by\'abarwayi biri ku rupapuro rwa ivuriro.',
  },
  {
    q: 'Nshobora guhagarika appointment?',
    a: 'Yego. Urashobora guhagarika appointment itegereje cyangwa yemejwe uhereye ku dashboard yawe cyangwa ku rupapuro rwa appointment, igihe ivuriro ritararangiza.',
  },
  {
    q: 'MTN Mobile Money ikora gute?',
    a: 'Iyo uhisemo MTN MoMo nk\'uburyo bwo kwishyura, icyifuzo cy\'ubwishyu cyohererezwa kuri nimero yawe ya MTN. Wemeza ukoresheje PIN yawe ya MTN kuri telephone yawe — nta karita ikenewe.',
  },
  {
    q: 'Amakuru yanjye y\'ubuzima afatwa neza?',
    a: 'Yego. Amakuru yose arindwa mu nzira no mu bubiko. Dukurikira amategeko y\'umutekano w\'amakuru y\'ubuzima kandi ntituzigana amakuru yawe nta mpushya.',
  },
  {
    q: 'Nshobora gukora ivuriro ryanjye?',
    a: 'Abatanga ubuvuzi bashobora kutumanahana binyuze kuri formulaire kuri uru rupapuro. Itsinda ryacu rizasuzuma ivuriro ryawe kandi riyobore mu nzira y\'iyinjira.',
  },
]

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

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-teal-600 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      <div className="page-container relative py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Serivisi zihari — Dufasha abarwayi muri Rwanda
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Ubuzima bwawe,<br />
              <span className="text-teal-300">buhuye</span> kandi bworoshe.
            </h1>

            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
              Tuza MediConnect ihuza abarwayi n'ivuriro ryemejwe mu Rwanda.
              Fata appointment, kurikirana ubuzima bwawe, kandi wishyure binyuze kuri MTN Mobile Money — ahantu hamwe.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/register">
                <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg">
                  <Calendar size={18} /> Fata Appointment
                </button>
              </Link>
              <Link to="/facilities">
                <button className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Search size={18} /> Shakisha Ivuriro
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Kwiyandikisha birangwa ubuntu</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> MTN Mobile Money</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Ivuriro ryemejwe</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-80 h-96">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60">Appointment iri imbere</p>
                    <p className="font-semibold text-white">Itariki y'isura</p>
                  </div>
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-400" />
                  </div>
                </div>
                {[
                  { icon: '🏥', label: 'Kigali Family Clinic',    sub: 'Isura Rusange'   },
                  { icon: '📅', label: 'Ejo, Saa 4:00 Z\'amahoro', sub: 'Yemejwe'        },
                  { icon: '💊', label: 'Serivisi: RWF 8,000',     sub: 'MTN MoMo ihari'  },
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
                  <p className="text-xs text-teal-300 font-medium text-center">✓ SMS y'ibibutsa yohererejwe</p>
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
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Inzira yoroshye</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Tuza MediConnect ikora gute</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kubona ubuvuzi bwiza ntibyigeze biroroshye. Inzira eshatu kugirango ubone appointment.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="card p-6 h-full hover:shadow-card-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl font-black text-gray-100">{step}</span>
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Icon size={22} className="text-primary-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
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
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Serivisi z'ubuzima</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Ubuvuzi busesuye ahantu hamwe</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kuva mu makuru rusange kugeza ubuvuzi bw'inzobere — fata appointment mu bwoko 18+ bwa serivisi.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {SERVICES.map(({ icon: Icon, name, color }) => (
            <div key={name} className="card p-4 text-center hover:shadow-card-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={22} />
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{name}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm">
            Reba serivisi zose 18+ <ArrowRight size={16} />
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
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Impamvu yo guhitamo</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Yakozwe kubw'abose mu buvuzi</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ku Barwayi</h3>
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
              Fungura konti ubuntu <ArrowRight size={15} />
            </Link>
          </div>

          <div className="card p-7 border-primary-200 bg-primary-50/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ku Batanga Ubuvuzi</h3>
            </div>
            <div className="space-y-3">
              {PROVIDER_BENEFITS.map(b => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{b}</span>
                </div>
              ))}
            </div>
            <a href="mailto:ivuriro@tuzamediconnect.rw"
              className="mt-6 inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
              Andikisha ivuriro ryawe <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'Marie Claire U.', role: 'Umurwayi, Kigali', text: 'Nafashe appointment y\'amenyo mu minota ibiri. SMS yo kwemeza yageze ako kanya. Ibi ni byo Rwanda rikanenera.' },
    { name: 'Dr. Eric H.',     role: 'Muganga Rusange',  text: 'Gucunga appointment z\'ivuriro ryacu byari bikomeye cyane. Tuza MediConnect yagabanyije cyane ababagiranye kugera.' },
    { name: 'Patrick N.',      role: 'Umurwayi, Musanze', text: 'Kwishyura kwa MTN MoMo kuroha. Nishyuye isura y\'amaraso kuri telephone yanjye nta njira yo kujya banki.' },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">Ibivugwa n'abacu</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Zizanwa n'abarwayi n'abatanga ubuvuzi</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ibibazo bikunze kubazwa</h2>
          <p className="text-gray-500">Ibyo ukeneye kumenya kuri Tuza MediConnect.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} className="text-primary-600 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
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
        <h2 className="text-3xl font-bold mb-4">Witegure gufata neza ubuzima bwawe?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
          Injira mu barwayi n'ivuriro bikoresheje Tuza MediConnect muri Rwanda.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/register">
            <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg">
              <Calendar size={18} /> Fata Appointment
            </button>
          </Link>
          <Link to="/login">
            <button className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors">
              Injira kuri konti yawe
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
              Huza abarwayi n'ivuriro ry'ubwiza muri Rwanda.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register" className="hover:text-white transition-colors">Fungura konti</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition-colors">Shakisha ivuriro</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Serivisi</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Injira</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Ku Batanga Ubuvuzi</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Andikisha ivuriro</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Porutali y'abakozi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Raporo ya API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Twandikire</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><MapPin size={11} /> Kigali, Rwanda</li>
              <li><a href="mailto:support@tuzamediconnect.rw" className="hover:text-white transition-colors">support@tuzamediconnect.rw</a></li>
              <li><a href="tel:+250780000000" className="hover:text-white transition-colors">+250 780 000 000</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs">© {new Date().getFullYear()} Tuza MediConnect. Porogaramu y'urugero — ntabwo ariyo serivisi nyayo y'ubuvuzi.</p>
          <div className="flex gap-5 text-xs">
            <a href="#" className="hover:text-white transition-colors">Politiki y'Ibanga</a>
            <a href="#" className="hover:text-white transition-colors">Amategeko y'Ikoreshwa</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
