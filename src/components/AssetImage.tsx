import React, { useState, useEffect } from 'react';
import { Shield, Target, Zap, User } from 'lucide-react';

type AssetImageProps = {
  src: string;
  alt: string;
  className?: string;
  type?: 'agent' | 'weapon' | 'armor' | 'ability';
  fallbackName?: string;
};

export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className = '',
  type = 'weapon',
  fallbackName,
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state whenever the src prop changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    const initials = (fallbackName || alt || '?')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();

    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#152230] border border-[#2a3e52] text-[#8b9bb4] p-2 select-none ${className}`}
        title={`${alt} (Placeholder)`}
      >
        {type === 'agent' && <User className="w-6 h-6 text-[#ff4655] mb-1" />}
        {type === 'weapon' && <Target className="w-6 h-6 text-[#ff4655] mb-1" />}
        {type === 'armor' && <Shield className="w-6 h-6 text-[#ff4655] mb-1" />}
        {type === 'ability' && <Zap className="w-6 h-6 text-[#ff4655] mb-1" />}
        <span className="text-[10px] font-mono font-semibold tracking-wider text-[#ece8e1]">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
