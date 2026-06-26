import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-surface w-full mt-auto border-t border-border-subtle">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-margin-desktop py-12 max-w-container-max mx-auto">
        <div>
          <span className="text-xl text-primary font-bold block mb-4">Nestify</span>
          <p className="text-sm text-text-muted">© 2024 Nestify. Elevated Living Experiences.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            About Us
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            Careers
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            Terms of Service
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            Contact Support
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-primary">
            Newsletter
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
