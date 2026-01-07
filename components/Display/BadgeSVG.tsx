
import React from 'react';
import { AchievementBadge } from '../../types';

interface Props {
  achievement: AchievementBadge;
  id?: string;
}

const BadgeSVG: React.FC<Props> = ({ achievement, id = "achievement-badge" }) => {
  const { rank, userName, count, date, type, fromRank } = achievement;
  
  // Theme selection based on rank and achievement type
  const isChampion = rank === 1;
  const isElite = rank > 1 && rank <= 3;
  const isLeap = type === 'leap';
  
  const colors = {
    primary: isChampion ? '#FBBF24' : isElite ? '#A78BFA' : isLeap ? '#10B981' : '#6366F1',
    secondary: isChampion ? '#B45309' : isElite ? '#7C3AED' : isLeap ? '#059669' : '#4338CA',
    bg: isChampion ? '#FFFBEB' : isElite ? '#F5F3FF' : isLeap ? '#ECFDF5' : '#EEF2FF',
    text: isChampion ? '#92400E' : isElite ? '#4C1D95' : isLeap ? '#064E3B' : '#312E81',
    accent: isChampion ? '#F59E0B' : isElite ? '#8B5CF6' : isLeap ? '#34D399' : '#818CF8'
  };

  const getBadgeTitle = () => {
    if (isChampion) return 'GLOBAL CHAMPION';
    if (isElite) return 'ELITE LEADER';
    if (isLeap) return 'MASSIVE RANK LEAP';
    if (type === 'climb') return 'RANK CLIMBER';
    return 'ACADEMIC PRO';
  };

  return (
    <svg 
      id={id}
      width="400" 
      height="400" 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="textShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Background Layers */}
      <circle cx="200" cy="200" r="195" fill="white" />
      <circle cx="200" cy="200" r="185" fill={colors.bg} stroke="url(#badgeGrad)" strokeWidth="6" />
      
      {/* Decorative Outer Ring with custom dashes for types */}
      <circle cx="200" cy="200" r="165" fill="transparent" stroke={colors.accent} strokeWidth="1.5" strokeDasharray={isChampion ? "1 0" : "15 10"} opacity="0.4" />

      {/* Background Geometry */}
      <path 
        d="M200 80 L310 145 L310 255 L200 320 L90 255 L90 145 Z" 
        fill="url(#badgeGrad)" 
        opacity="0.08" 
      />

      {/* Icon Area / Rank Indicator */}
      <g transform="translate(200, 135)">
        <circle r="50" fill="url(#badgeGrad)" filter={isChampion ? "url(#glow)" : ""} />
        <text 
          y="15" 
          textAnchor="middle" 
          fill="white" 
          fontSize="42" 
          fontWeight="900" 
          fontFamily="Inter, sans-serif"
          filter="url(#textShadow)"
        >
          #{rank}
        </text>
      </g>

      {/* Achievement Label */}
      <g transform="translate(200, 205)">
        <rect x="-80" y="-12" width="160" height="24" rx="12" fill={colors.bg} stroke={colors.accent} strokeWidth="1" />
        <text 
          y="4" 
          textAnchor="middle" 
          fill={colors.text} 
          fontSize="11" 
          fontWeight="900" 
          letterSpacing="1.5"
          fontFamily="Inter, sans-serif"
        >
          {getBadgeTitle()}
        </text>
      </g>

      {/* User Name */}
      <text 
        x="200" 
        y="255" 
        textAnchor="middle" 
        fill={colors.secondary} 
        fontSize="28" 
        fontWeight="800" 
        fontFamily="Inter, sans-serif"
      >
        {userName.toUpperCase()}
      </text>

      {/* Progress Detail */}
      {fromRank && (
        <text 
          x="200" 
          y="280" 
          textAnchor="middle" 
          fill={colors.accent} 
          fontSize="12" 
          fontWeight="700" 
          fontFamily="Inter, sans-serif"
        >
          CLIMBED FROM #{fromRank}
        </text>
      )}

      {/* Stat Divider */}
      <rect x="140" y="295" width="120" height="2" fill={colors.accent} opacity="0.3" rx="1" />

      {/* Generation Count */}
      <text 
        x="200" 
        y="325" 
        textAnchor="middle" 
        fill={colors.text} 
        fontSize="16" 
        fontWeight="700" 
        fontFamily="Inter, sans-serif"
      >
        {count} Study Modules Today
      </text>

      {/* App Branding */}
      <g transform="translate(200, 365)">
        <rect x="-85" y="-14" width="170" height="28" rx="14" fill={colors.secondary} />
        <text 
          y="5" 
          textAnchor="middle" 
          fill="white" 
          fontSize="11" 
          fontWeight="900" 
          letterSpacing="1.2"
          fontFamily="Inter, sans-serif"
        >
          STUDYCLUB24.APP
        </text>
      </g>

      {/* Date */}
      <text 
        x="200" 
        y="392" 
        textAnchor="middle" 
        fill="#94A3B8" 
        fontSize="10" 
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        {date}
      </text>

      {/* Victory Sparkles for High Tiers */}
      {(isChampion || isElite) && (
        <g>
           <circle cx="60" cy="100" r="4" fill={colors.primary} />
           <circle cx="340" cy="140" r="6" fill={colors.primary} />
           <circle cx="90" cy="310" r="3" fill={colors.accent} />
           <circle cx="310" cy="280" r="5" fill={colors.accent} />
           {isChampion && <path d="M200 40 L205 50 L215 50 L207 57 L210 67 L200 62 L190 67 L193 57 L185 50 L195 50 Z" fill={colors.primary} />}
        </g>
      )}
    </svg>
  );
};

export default BadgeSVG;
