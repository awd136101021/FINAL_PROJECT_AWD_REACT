import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full text-white overflow-hidden">
      {/* 🔹 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001a3d] via-[#002b5c] to-[#004080] animate-gradient-x opacity-95"></div>

      <div className="relative max-w-[1200px] mx-auto px-8 py-14 flex flex-wrap justify-between items-start gap-10">
        
        {/* 🔹 Logo & Description */}
        <div className="flex flex-col items-center sm:items-start space-y-4 w-full sm:w-auto">
          <div className="flex items-center space-x-3">
            <img
              src="/images/logo.png"
              alt="CS Logo"
              className="w-20 hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_#ffcc00]"
            />
            <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#ffcc00] to-[#fff8cc] bg-clip-text text-transparent">
              Computer Science
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs backdrop-blur-sm p-3 rounded-xl bg-white/10">
            Empowering innovation and excellence through technology and education at the University of Gujrat.
          </p>
        </div>

        {/* 🔹 Quick Links */}
        <div className="min-w-[160px]">
          <h3 className="text-[#ffcc00] mb-3 text-lg font-semibold border-b-2 border-[#ffcc00]/40 pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-200">
            {["Programs", "About Us", "Faculty", "FAQs", "Contact Us"].map(
              (item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s/g, "")}`}
                    className="relative inline-block transition-all duration-300 hover:text-[#ffcc00] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#ffcc00] after:transition-all after:duration-300"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* 🔹 Contact Info */}
        <div className="text-gray-200">
          <h3 className="text-[#ffcc00] mb-3 text-lg font-semibold border-b-2 border-[#ffcc00]/40 pb-1">
            Contact Us
          </h3>
          {[
            "📞 0326-7356166",
            "📞 0344-6710225",
            "✉️ iamabdullahtanveer@gmail.com",
          ].map((info, i) => (
            <p
              key={i}
              className="hover:text-[#ffcc00] transition-colors duration-300"
            >
              {info}
            </p>
          ))}
        </div>

        {/* 🔹 Social Links */}
        <div className="text-gray-200">
          <h3 className="text-[#ffcc00] mb-3 text-lg font-semibold border-b-2 border-[#ffcc00]/40 pb-1">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            {[
              {
                href: "https://www.facebook.com/iamabdullahtanveer/",
                src: "/images/fb-logo.png",
                alt: "Facebook",
              },
              {
                href: "https://www.linkedin.com/in/abdullah-tanveer-570216338/",
                src: "/images/linkedln-logo.png",
                alt: "LinkedIn",
              },
              {
                href: "https://www.instagram.com/abdullah_tanveer__/",
                src: "/images/insta-logo.jpeg",
                alt: "Instagram",
              },
            ].map(({ href, src, alt }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative transform hover:scale-110 transition-transform duration-300"
              >
                <div className="absolute -inset-1 bg-[#ffcc00] opacity-0 group-hover:opacity-30 blur-md rounded-full transition-all duration-300"></div>
                <img
                  src={src}
                  alt={alt}
                  className="relative w-10 h-10 rounded-full bg-white p-1 shadow-lg group-hover:shadow-[0_0_20px_#ffcc00]"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Bar */}
      <div className="relative text-center border-t border-[#ffffff33] py-4 text-sm text-gray-300 bg-[#001a3d]/60 backdrop-blur-md">
        &copy; 2025{" "}
        <span className="text-[#ffcc00] font-semibold">CS Department</span>, University of Gujrat.{" "}
        <span className="text-gray-400">All Rights Reserved.</span>
      </div>
    </footer>
  );
}
