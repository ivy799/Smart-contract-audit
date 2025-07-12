import React from "react";

const Footer = () => {
  return (
    <footer className="flex gap-6 flex-wrap items-center justify-center text-sm relative z-20 py-4 mt-auto flex-shrink-0">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        href="#"
      >
        Learn
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        href="#"
      >
        Examples
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        href="#"
      >
        Term and Conditions
      </a>
    </footer>
  );
};

export default Footer;
