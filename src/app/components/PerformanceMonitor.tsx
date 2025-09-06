"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined" || !("performance" in window)) {
      return;
    }

    // Collect performance metrics
    const collectMetrics = () => {
      const metrics: PerformanceMetrics = {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
      };

      // First Contentful Paint (FCP)
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // Time to First Byte (TTFB)
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      // Log metrics to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("Performance Metrics:", metrics);
      }

      // In production, you could send these metrics to an analytics service
      if (process.env.NODE_ENV === "production") {
        // Example: sendToAnalytics(metrics);
      }
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      setTimeout(collectMetrics, 0);
    } else {
      window.addEventListener("load", () => {
        setTimeout(collectMetrics, 0);
      });
    }

    // Set up observers for LCP and CLS
    let lcpValue = 0;
    let clsValue = 0;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcpValue = lastEntry.startTime;
    });

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {
      console.warn("LCP observer not supported");
    }

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (e) {
      console.warn("CLS observer not supported");
    }

    // Final metrics collection before page unload
    const handleBeforeUnload = () => {
      const finalMetrics: PerformanceMetrics = {
        fcp: null,
        lcp: lcpValue || null,
        fid: null,
        cls: clsValue || null,
        ttfb: null,
      };

      // Collect FCP and TTFB again
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcpEntry) {
        finalMetrics.fcp = fcpEntry.startTime;
      }

      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        finalMetrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      if (process.env.NODE_ENV === "development") {
        console.log("Final Performance Metrics:", finalMetrics);
      }

      // In production, you could send these metrics to an analytics service
      if (process.env.NODE_ENV === "production") {
        // Example: sendToAnalytics(finalMetrics);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}