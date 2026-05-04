export default function CategoryIcon({ categoryId, size = 20, color = 'currentColor' }) {
  const svg = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    display: 'block',
    flexShrink: 0,
  }

  switch (categoryId) {
    case 'insect':
      return (
        <svg {...svg}>
          <ellipse cx="12" cy="14.5" rx="3" ry="4.5" />
          <circle cx="12" cy="8.5" r="2.5" />
          <line x1="10.8" y1="6.3" x2="8.5" y2="3" />
          <line x1="13.2" y1="6.3" x2="15.5" y2="3" />
          <line x1="9" y1="11" x2="4" y2="9.5" />
          <line x1="9" y1="14.5" x2="4" y2="14.5" />
          <line x1="9" y1="18" x2="4" y2="19.5" />
          <line x1="15" y1="11" x2="20" y2="9.5" />
          <line x1="15" y1="14.5" x2="20" y2="14.5" />
          <line x1="15" y1="18" x2="20" y2="19.5" />
        </svg>
      )

    case 'invertebrate':
      return (
        <svg {...svg}>
          <path d="M12 12 C12 10 14 9 15.5 10 C17 11.5 16.5 14.5 14.5 15.5 C12 17 8.5 15.5 7.5 12.5 C6.5 9 8.5 5.5 12 4.5 C15.5 3.5 20 6 20.5 10.5 C21.5 16 17.5 21 12 21.5" />
          <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
        </svg>
      )

    case 'plant':
      return (
        <svg {...svg}>
          <path d="M12 21 C12 21 5 16 5 10 C5 5.5 8.5 3 12 3 C15.5 3 19 5.5 19 10 C19 16 12 21 12 21Z" />
          <line x1="12" y1="21" x2="12" y2="8" />
        </svg>
      )

    case 'mammal':
      return (
        <svg {...svg}>
          <ellipse cx="12" cy="16.5" rx="4.5" ry="3.5" />
          <circle cx="7.5" cy="12" r="1.8" />
          <circle cx="10.5" cy="10.5" r="1.8" />
          <circle cx="13.5" cy="10.5" r="1.8" />
          <circle cx="16.5" cy="12" r="1.8" />
        </svg>
      )

    case 'bird':
      return (
        <svg {...svg}>
          <path d="M2 10 C5 5.5 9 8 12 10 C15 8 19 5.5 22 10" />
          <ellipse cx="12" cy="13" rx="2.5" ry="1.5" />
          <line x1="10" y1="14" x2="8.5" y2="17.5" />
          <line x1="14" y1="14" x2="15.5" y2="17.5" />
        </svg>
      )

    case 'fish':
      return (
        <svg {...svg}>
          <path d="M15 12 C15 8 12 6 8 7 C4 8 2 10 2 12 C2 14 4 16 8 17 C12 18 15 16 15 12Z" />
          <path d="M15 9.5 L22 7 L22 17 L15 14.5" />
          <circle cx="6.5" cy="11.5" r="1" fill={color} stroke="none" />
        </svg>
      )

    case 'amphibian':
      return (
        <svg {...svg}>
          <ellipse cx="12" cy="15.5" rx="6" ry="4.5" />
          <circle cx="8.5" cy="11" r="2.5" />
          <circle cx="15.5" cy="11" r="2.5" />
          <path d="M7 19 L5 21.5 M9.5 20 L9 22.5 M14.5 20 L15 22.5 M17 19 L19 21.5" />
        </svg>
      )

    case 'reptile':
      return (
        <svg {...svg}>
          <ellipse cx="11" cy="14" rx="5.5" ry="2.5" transform="rotate(-8 11 14)" />
          <ellipse cx="17" cy="11" rx="3.5" ry="2" transform="rotate(-8 17 11)" />
          <path d="M5.5 15 Q3 17 1.5 14.5" />
          <line x1="16" y1="12.5" x2="18" y2="8" />
          <line x1="13.5" y1="12" x2="13.5" y2="7.5" />
          <line x1="9" y1="15.5" x2="7.5" y2="20" />
          <line x1="12" y1="16.5" x2="12.5" y2="21" />
        </svg>
      )

    default:
      return null
  }
}
