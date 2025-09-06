import * as React from "react";
import { OptimizedImage } from "./OptimizedImage";

// This function is used to resolve the components used in MDX files
export function useMDXComponents(components: {
  // Allows customizing built-in components, e.g. to add styling.
  img?: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
}): Record<string, React.ComponentType<any>> {
  return {
    // Wrap the img tag with our OptimizedImage component
    img: (props) => {
      // Extract width and height from style if they exist
      let width = props.width ? parseInt(props.width as string) : undefined;
      let height = props.height ? parseInt(props.height as string) : undefined;
      
      // If width and height are not provided, use default values
      if (!width || !height) {
        width = 800;
        height = 450;
      }

      return (
        <OptimizedImage
          src={props.src as string}
          alt={props.alt as string}
          width={width}
          height={height}
          className={props.className}
        />
      );
    },
    // Forward any custom components
    ...components,
  };
}