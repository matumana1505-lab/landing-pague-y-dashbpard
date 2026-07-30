export function Footer() {
  return (
    <footer id="contacto" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <span className="text-sm font-medium text-white">Resply</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidad
            </a>
            <a href="mailto:hola@resply.io" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 Resply
          </p>
        </div>
      </div>
    </footer>
  )
}
