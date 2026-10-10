import React from 'react';

export interface ExperienceModeComponentProps {
  className?: string;
  label?: string;
  subtitle?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Zero-UI compatibility stubs to prevent [UNRESOLVED_IMPORT] build errors
 * if any legacy screen or branch imports '../shared/ExperienceModeSwitcher'.
 */
export const FloatingExperienceModePill: React.FC<ExperienceModeComponentProps> = () => null;
export const BangladeshHeritageBadge: React.FC<ExperienceModeComponentProps> = () => null;
export const NakshiStitchDivider: React.FC<ExperienceModeComponentProps> = () => null;
export const RickshawCornerMotif: React.FC<ExperienceModeComponentProps> = () => null;
export const CulturalSectionBadge: React.FC<ExperienceModeComponentProps> = () => null;
export const ExperienceModeStudioCard: React.FC<ExperienceModeComponentProps> = () => null;
export const ExperienceModeHeaderPill: React.FC<ExperienceModeComponentProps> = () => null;
export const ExperienceModeBanner: React.FC<ExperienceModeComponentProps> = () => null;
export const ExperienceModeSwitcher: React.FC<ExperienceModeComponentProps> = () => null;

export default ExperienceModeSwitcher;
