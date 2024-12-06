"use client";

import Link from "next/link";
import { siX, siInstagram, siLinkedin } from "simple-icons";
import { NeutralLogo } from "./Logo";

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/reviews", label: "Reviews" },
      { href: "/reviews/new", label: "Write a Review" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
] as const;

const socialIcons = [
  { href: "#", label: "Twitter", icon: siX },
  { href: "#", label: "Instagram", icon: siInstagram },
  { href: "#", label: "LinkedIn", icon: siLinkedin },
] as const;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Logo and tagline */}
          <div className="flex flex-col gap-4">
            <NeutralLogo height={24} />
            <p className="text-sm text-muted-foreground max-w-xs">
              Share and discover honest reviews about your stays around the world
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StayScore. All rights reserved.
          </p>
          
          {/* Social links */}
          <div className="mt-4 flex items-center gap-4 sm:mt-0">
            {socialIcons.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-primary"
                aria-label={social.label}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{social.label}</title>
                  <path d={social.icon.path} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Make sure to export the component as default
export default Footer;