import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center space-y-6 pt-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="p-4 rounded-full bg-[var(--terminal-green)]/10 border border-[var(--terminal-green)]/30"
        >
          <CheckCircle2 className="w-12 h-12 text-[var(--terminal-green)]" />
        </motion.div>

        <div className="space-y-3">
          <div className="text-[var(--terminal-green)] font-mono text-sm">
            // INTAKE_COMPLETE
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Thank You!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your application has been submitted successfully. We&apos;ll review your information
            and see you on the call.
          </p>
        </div>

        <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-1 pt-6">
          <Shield className="w-3 h-3" />
          Your information is secure and confidential.
        </p>
      </motion.div>
    </div>
  );
};
