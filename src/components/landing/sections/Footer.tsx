
import { Scale, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Producto',
    links: ['Características', 'Integraciones', 'Precios', 'Roadmap', 'API']
  },
  {
    title: 'Empresa',
    links: ['Sobre nosotros', 'Equipo', 'Blog', 'Carreras', 'Contacto']
  },
  {
    title: 'Legal',
    links: ['Privacidad', 'Términos', 'Cookies', 'GDPR', 'Seguridad']
  }
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' }
];

export function Footer() {
  return (
    <footer className="bg-theme-secondary text-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold">DerechGo</span>
            </div>
            <p className="text-theme-tertiary mb-4 max-w-sm">
              El software de gestión legal que transforma despachos. Diseñado por abogados, para abogados.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-theme-tertiary rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinks.map((group, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-theme-tertiary hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-theme flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-theme-tertiary text-sm">
            © 2026 DerechGo. Todos los derechos reservados.
          </p>
          <p className="text-theme-muted text-sm">
            Hecho con ❤️ para el sector legal
          </p>
        </div>
      </div>
    </footer>
  );
}
