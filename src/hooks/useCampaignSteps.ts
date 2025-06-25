
import { useState } from 'react';

export function useCampaignSteps(initialStep: number = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return {
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious,
  };
}

