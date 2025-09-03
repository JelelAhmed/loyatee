export function YataLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background badge behind "Y" */}
      <rect x="0" y="0" width="60" height="60" rx="12" fill="url(#grad)" />

      {/* Y Letter */}
      <text
        x="30"
        y="38"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fill="black"
        fontFamily="Poppins, sans-serif"
      >
        Y
      </text>

      {/* Rest of wordmark */}
      <text
        x="80"
        y="38"
        fontSize="28"
        fontWeight="700"
        fill="white"
        fontFamily="Poppins, sans-serif"
      >
        ata
      </text>

      {/* Gradient Defs */}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="60" y2="60">
          <stop offset="0%" stopColor="#34d399" /> {/* emerald-400 */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500 */}
        </linearGradient>
      </defs>
    </svg>
  );
}

export function YataLogoPlayful({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="10"
        y="50"
        fontSize="40"
        fontWeight="900"
        fontFamily="Quicksand, Poppins, sans-serif"
        fill="url(#grad2)"
      >
        Yata
      </text>
      <path
        d="M12 60 Q110 80 208 60"
        stroke="url(#grad2)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="grad2" x1="0" y1="0" x2="200" y2="0">
          <stop offset="0%" stopColor="#a78bfa" /> {/* violet-400 */}
          <stop offset="100%" stopColor="#34d399" /> {/* emerald-400 */}
        </linearGradient>
      </defs>
    </svg>
  );
}

export function YataLogoBadge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="60" height="60" rx="12" fill="url(#grad)" />
      <text
        x="30"
        y="38"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fill="black"
        fontFamily="Poppins, sans-serif"
      >
        Y
      </text>
      <text
        x="80"
        y="38"
        fontSize="28"
        fontWeight="700"
        fill="white"
        fontFamily="Poppins, sans-serif"
      >
        ata
      </text>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="60" y2="60">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function YataLogoMinimal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="10"
        y="40"
        fontSize="32"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        fill="white"
        letterSpacing="2"
      >
        YATA
      </text>
      <rect x="8" y="45" width="70" height="5" rx="2" fill="url(#grad3)" />
      <defs>
        <linearGradient id="grad3" x1="0" y1="0" x2="70" y2="0">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}
