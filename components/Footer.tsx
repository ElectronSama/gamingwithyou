import { 
  Gamepad2, 
  Github, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Heart
} from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-green-700">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Mobile: 3 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand - Full width on mobile, first column on desktop */}
          <div className="col-span-3 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-green-300" />
              <span className="text-xl font-bold text-white">GamingWithYou</span>
            </div>
            <p className="text-gray-300 text-sm text-justify">
              Connect with gamers, book sessions, and discover amazing gaming experiences.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-white font-semibold text-sm md:text-base">Platform</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/games" className="text-gray-300 hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/gamers" className="text-gray-300 hover:text-white transition-colors">
                  Find Gamers
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-white font-semibold text-sm md:text-base">Support</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-300 hover:text-white transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-white font-semibold text-sm md:text-base">Legal</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
            © {currentYear} GamingWithYou. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-xs md:text-sm">
            <span>Made with</span>
            <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
            <span>by the GamingWithYou Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 