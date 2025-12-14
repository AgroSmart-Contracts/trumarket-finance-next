import React from 'react';
import { Info } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskBadgeProps {
    risk: RiskLevel;
    showLabel?: boolean;
    size?: 'sm' | 'md';
    className?: string;
    showInfoIcon?: boolean;
}

const riskConfig: Record<RiskLevel, { color: string; letter: string; label: string; description: string }> = {
    low: {
        color: '#398F45',
        letter: 'A',
        label: 'Low Risk',
        description: 'Highly secure profile with a significant negative APY modifier. Deal Risk Score is low due to high counterparty reliability and favorable contract terms. This is reinforced by stable geography and optimal product/seasonal conditions.',
    },
    medium: {
        color: '#F9B922',
        letter: 'B',
        label: 'Medium Risk',
        description: 'Balanced risk profile with no APY adjustment. Deal Risk Score is neutral, reflecting moderate counterparty reliability and standard contract terms. Risk factors across geography, season, and product are average.',
    },
    high: {
        color: '#BB1818',
        letter: 'C',
        label: 'High Risk',
        description: 'High-reward opportunity with a significant positive APY modifier. Deal Risk Score is high due to moderate counterparty reliability and standard contract terms. This deal is also exposed to volatile geography, challenging season, or perishable product risk.',
    },
};

/**
 * Reusable risk badge component with letter grade and optional info tooltip
 */
export const RiskBadge: React.FC<RiskBadgeProps> = ({
    risk,
    showLabel = false,
    size = 'md',
    className,
    showInfoIcon = true,
}) => {
    const config = riskConfig[risk];
    const sizeClasses = size === 'sm' ? 'w-4 h-4 text-xs' : 'w-5 h-5 text-xs';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className={cn(
                    'rounded-full flex items-center justify-center text-white font-semibold border-2',
                    sizeClasses
                )}
                style={{
                    backgroundColor: config.color,
                    borderColor: config.color,
                }}
            >
                {config.letter}
            </div>
            {showLabel && (
                <span className="text-base leading-6 font-normal text-[#0F172B]">
                    {config.label}
                </span>
            )}
            {showInfoIcon && (
                <Tooltip.Provider delayDuration={200}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <button
                                type="button"
                                className="flex items-center justify-center cursor-help focus:outline-none"
                                aria-label={`Information about ${config.label}`}
                            >
                                <Info
                                    className={cn(
                                        'text-[#90A1B9] hover:text-[#62748E] transition-colors',
                                        iconSize
                                    )}
                                />
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                className="bg-[#0F172B] text-white text-sm leading-5 rounded-lg px-4 py-3 shadow-lg max-w-xs z-50"
                                sideOffset={5}
                                side="top"
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold text-white mb-1">
                                        {config.label} ({config.letter})
                                    </div>
                                    <p className="text-white/90 text-xs leading-5">
                                        {config.description}
                                    </p>
                                </div>
                                <Tooltip.Arrow className="fill-[#0F172B]" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            )}
        </div>
    );
};
