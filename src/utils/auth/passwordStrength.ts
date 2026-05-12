export interface PasswordStrength {
  score: number; // 0-5
  label: string; // "" | "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
  color: string; // hex color for the strength level
}

/**
 * Calculates password strength based on 5 conditions:
 * 1. At least 8 characters in length
 * 2. Contains at least one uppercase letter
 * 3. Contains at least one lowercase letter
 * 4. Contains at least one digit
 * 5. Contains at least one special character
 *
 * Returns a score (0-5), a human-readable label, and a color.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels: PasswordStrength[] = [
    { score: 1, label: "Very Weak", color: "#EF4444" },
    { score: 2, label: "Weak", color: "#F97316" },
    { score: 3, label: "Fair", color: "#F59E0B" },
    { score: 4, label: "Strong", color: "#10B981" },
    { score: 5, label: "Very Strong", color: "#059669" },
  ];

  if (score === 0) return { score: 0, label: "", color: "" };

  return levels[score - 1];
}
