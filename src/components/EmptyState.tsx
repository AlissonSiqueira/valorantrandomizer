import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';

type EmptyStateProps = {
  title?: string;
  message: string;
  onResetSettings?: () => void;
  onOpenSettings?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Available',
  message,
  onResetSettings,
  onOpenSettings,
}) => {
  return (
    <div className="w-full val-panel val-clip-corner p-6 border-l-4 border-l-[#ff4655] text-center space-y-4 my-4">
      <div className="flex justify-center">
        <AssetImage
          src={assetPath('/assets/images/warning.webp')}
          alt="Warning"
          type="ability"
          fallbackName="WARN"
          className="w-10 h-10 object-contain animate-bounce"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold font-tactical uppercase tracking-wider text-white">
          {title}
        </h3>
        <p className="text-sm text-[#8b9bb4] mt-1 max-w-md mx-auto">{message}</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff4655] hover:bg-[#e03e4d] text-white font-mono text-xs font-bold uppercase tracking-wider val-clip-btn transition-colors"
          >
            <Settings className="w-4 h-4" /> Adjust Settings
          </button>
        )}
        {onResetSettings && (
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-2 px-4 py-2 bg-[#152230] border border-[#2a3e52] hover:border-white text-[#ece8e1] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
