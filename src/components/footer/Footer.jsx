const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">

        <div className="flex items-center gap-3">
          <img src="/lg.png" alt="Fit.it" className="h-10" />
          <span className="text-white/60 text-sm">
            © {new Date().getFullYear()} Fit.it
          </span>
        </div>

        <div className="flex gap-6 text-white/60 text-sm">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#why-us" className="hover:text-white">Why Us</a>
          <a href="/login" className="hover:text-white">Login</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;