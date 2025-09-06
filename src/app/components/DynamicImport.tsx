"use client";

import { useState, useEffect, Suspense } from "react";

interface DynamicImportProps {
  loader: () => Promise<any>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export function DynamicImport({ 
  loader, 
  fallback = <div>Loading...</div>, 
  children 
}: DynamicImportProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    loader().then((module) => {
      setComponent(() => module.default || module);
    });
  }, [loader]);

  if (!Component) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      <Component>{children}</Component>
    </Suspense>
  );
}