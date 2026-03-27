"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { getEstimatedTime } from "@/lib/utils";

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  disableNext?: boolean;
  nextLabel?: string;
};

export function StepWizard({
  step,
  totalSteps,
  title,
  children,
  onNext,
  onBack,
  disableNext,
  nextLabel = "Continue"
}: Props) {
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-[#2B2B34] bg-[#111117] p-6 shadow-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-[#A8A8B3]">
          <span>
            Step {step + 1} / {totalSteps}
          </span>
          <span>{getEstimatedTime(step)}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#22222a]">
          <div className="h-2 rounded-full bg-[#E8760A] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="min-h-[320px]"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-[#3A3A46] px-4 py-2 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E8760A] px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
