import { Logo } from "@/components/brand/Logo";
import { WhatsAppNumberDisplay } from "@/components/whatsapp/WhatsAppNumberDisplay";
import { businessConfig, navItems } from "@/config/business";
import { services } from "@/data/services";
import { isAddressConfigured, isOpeningHoursConfigured } from "@/lib/contact";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#070b14] pb-24 pt-14">
      <div className="container-page grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted">{businessConfig.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Tautan</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-muted transition hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Layanan</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <a href="#layanan" className="text-muted transition hover:text-white">
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{businessConfig.name}</li>
            <li>Pemilik: {businessConfig.owner}</li>
            <li>
              <WhatsAppNumberDisplay
                prefix="WhatsApp: "
                fallback="WhatsApp belum dikonfigurasi"
              />
            </li>
            <li>
              {isAddressConfigured()
                ? businessConfig.address
                : "Alamat toko belum dikonfigurasi"}
            </li>
            <li>
              {isOpeningHoursConfigured()
                ? businessConfig.openingHours
                : "Jam operasional belum dikonfigurasi"}
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-10 border-t border-white/10 pt-6 text-sm text-muted">
        <p>
          © {year} {businessConfig.name}. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
