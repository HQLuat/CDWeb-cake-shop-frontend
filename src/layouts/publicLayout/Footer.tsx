function Footer() {
  return (
    <footer className="py-10 border-t border-solid border-[#e0dbd1]">
      <div className="flex justify-between items-start max-w-300 mx-auto px-5">
        {/* Footer left */}
        <div className="w-[30%]">
          <div className="font-lora text-[20px] font-semibold text-primary mb-2.5">
            Velvet Muse Bakery
          </div>
          <p className="text-[12px] text-text-light">
            Artisan baking with a modern artistic vision. Every crumb tells a
            story of tradition and luxury.
          </p>
        </div>
        {/* Footer links */}
        <div className="flex gap-5">
          <a
            href="#"
            className="text-[12px] text-text-light uppercase no-underline"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-[12px] text-text-light uppercase no-underline"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-[12px] text-text-light uppercase no-underline"
          >
            Contact Us
          </a>
          <a
            href="#"
            className="text-[12px] text-text-light uppercase no-underline"
          >
            Privacy Policy
          </a>
        </div>
        {/* Footer right */}
        <div className="text-[12px] text-[#999]">
          © 2026 ARTISAN EDITORIAL. HANDCRAFTED WITH LOVE.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
