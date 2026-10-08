interface PasswordStrengthProps {
  password: string
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8)               score++
  if (/[A-Z]/.test(pw))             score++
  if (/[a-z]/.test(pw))             score++
  if (/\d/.test(pw))                score++
  if (/[^A-Za-z0-9]/.test(pw))      score++

  if (score <= 2) return { score, label: 'Weak',   color: 'bg-red-400'    }
  if (score === 3) return { score, label: 'Fair',   color: 'bg-yellow-400' }
  if (score === 4) return { score, label: 'Good',   color: 'bg-blue-400'   }
  return              { score, label: 'Strong', color: 'bg-green-500'  }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null
  const { score, label, color } = getStrength(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i <= score ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  )
}
