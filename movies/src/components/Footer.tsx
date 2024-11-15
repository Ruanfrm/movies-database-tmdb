// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className=" text-zinc-950 dark:text-zinc-50 py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Ruan Freire. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
