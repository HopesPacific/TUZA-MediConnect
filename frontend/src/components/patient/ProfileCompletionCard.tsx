import { Link } from 'react-router-dom'
import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

interface ProfileCompletionCardProps {
  completion: number
  profile: {
    date_of_birth: string | null
    gender: string | null
    location: string | null
    blood_group: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
  } | null
}

export function ProfileCompletionCard({ completion, profile }: ProfileCompletionCardProps) {
  const steps = [
    { label: 'Date of birth',       done: !!profile?.date_of_birth      },
    { label: 'Gender',              done: !!profile?.gender              },
    { label: 'Location',            done: !!profile?.location            },
    { label: 'Blood group',         done: !!profile?.blood_group         },
    { label: 'Emergency contact',   done: !!profile?.emergency_contact_name },
  ]

  const isComplete = completion >= 100

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Profile Completion</h3>
        <span className={clsx(
          'text-sm font-bold',
          completion === 100 ? 'text-green-600' :
          completion >= 60   ? 'text-blue-600'  : 'text-yellow-600',
        )}>
          {completion}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            completion === 100 ? 'bg-green-500' :
            completion >= 60   ? 'bg-primary-500' : 'bg-yellow-400',
          )}
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        {steps.map(step => (
          <div key={step.label} className="flex items-center gap-2.5">
            {step.done
              ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              : <Circle     size={14} className="text-gray-300 flex-shrink-0" />
            }
            <span className={clsx(
              'text-xs',
              step.done ? 'text-gray-500 line-through' : 'text-gray-700',
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {!isComplete && (
        <Link
          to="/patient/profile"
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
        >
          Complete profile <ArrowRight size={13} />
        </Link>
      )}
    </div>
  )
}
