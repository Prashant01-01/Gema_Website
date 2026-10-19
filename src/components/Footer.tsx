import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[var(--primary-dark)] to-[#5a0000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="GEMA" width={56} height={56} className="w-14 h-14" />
              <h3 className="font-bold text-lg">GEMA</h3>
            </div>
            <p className="text-sm text-red-200">
              Guwahati Electrical Merchants Association, serving the electrical
              trade community of Guwahati, Assam.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--gold)]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-red-200">
              <li><Link href="/resources/price-lists" className="hover:text-white transition-colors">Price Lists</Link></li>
              <li><Link href="/about/members" className="hover:text-white transition-colors">Members</Link></li>
              <li><Link href="/resources/circulars" className="hover:text-white transition-colors">Circulars</Link></li>
              <li><Link href="/events/exhibitions" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--gold)]">About</h4>
            <ul className="space-y-2 text-sm text-red-200">
              <li><Link href="/about/executive-committee" className="hover:text-white transition-colors">Executive Committee</Link></li>
              <li><Link href="/about/constitution" className="hover:text-white transition-colors">Constitution</Link></li>
              <li><Link href="/membership" className="hover:text-white transition-colors">Membership</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--gold)]">Contact</h4>
            <div className="text-sm text-red-200 space-y-2">
              <p>Guwahati, Assam, India</p>
              <p>info@gema.org.in</p>
            </div>
          </div>
        </div>
        <div className="border-t border-red-900 mt-8 pt-6 text-center text-sm text-red-300">
          &copy; 2026 GEMA, Guwahati Electrical Merchants Association. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
