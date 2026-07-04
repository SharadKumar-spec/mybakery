import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bakery-900 text-[#fef3c7] mt-0 pt-16 pb-8 border-t-[6px] border-[#d97706] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Socials */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">Vatika Bakery</h2>
            <p className="text-[#fef3c7]/80 text-sm leading-relaxed mb-6">
              Baking the world a better place. We use only the finest ingredients to create our signature premium treats.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-[#d97706] hover:text-white transition-colors duration-300 flex items-center justify-center font-bold w-10 h-10">
                f
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-[#d97706] hover:text-white transition-colors duration-300 flex items-center justify-center font-bold w-10 h-10">
                in
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-[#d97706] hover:text-white transition-colors duration-300 flex items-center justify-center font-bold w-10 h-10">
                yt
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-[#d97706] hover:text-white transition-colors duration-300 flex items-center justify-center font-bold w-10 h-10">
                x
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-[#fcd34d] transition-colors flex items-center"><span className="mr-2">›</span> Home</a></li>
              <li><a href="#" className="hover:text-[#fcd34d] transition-colors flex items-center"><span className="mr-2">›</span> Products</a></li>
              <li><a href="#" className="hover:text-[#fcd34d] transition-colors flex items-center"><span className="mr-2">›</span> Offers</a></li>
              <li><a href="#" className="hover:text-[#fcd34d] transition-colors flex items-center"><span className="mr-2">›</span> About Us</a></li>
              <li><a href="#" className="hover:text-[#fcd34d] transition-colors flex items-center"><span className="mr-2">›</span> Contact</a></li>
            </ul>
          </div>
          
          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Business Hours</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-[#d97706] shrink-0" />
                <div>
                  <span className="block text-white">Monday – Friday</span>
                  <span className="text-[#fef3c7]/80">8:00 AM – 9:00 PM</span>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-[#d97706] shrink-0" />
                <div>
                  <span className="block text-white">Saturday – Sunday</span>
                  <span className="text-[#fef3c7]/80">7:00 AM – 10:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#d97706] shrink-0 mt-0.5" />
                <span className="leading-relaxed">123 Baker Street,<br/>Sweet District,<br/>Foodville, FV 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-[#d97706] shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-[#d97706] shrink-0" />
                <span>hello@vatikabakery.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#fef3c7]/60">
          <p>© 2026 Vatika Bakery. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
