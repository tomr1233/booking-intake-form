import React from 'react';

interface FormMainContentProps {
  stepEyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const FormMainContent: React.FC<FormMainContentProps> = ({
  stepEyebrow,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex-1">
      <div className="space-y-6">
        <div>
          <div className="text-primary font-mono text-sm mb-2">{stepEyebrow}</div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
