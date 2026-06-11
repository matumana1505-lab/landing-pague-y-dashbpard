export function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Resply</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2024 Resply
          </p>
        </div>
      </div>
    </footer>
  )
}
