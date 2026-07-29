import { contact, identity } from "@/content/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bone/10">
      <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-ember text-sm font-semibold text-bone">
            {identity.name.charAt(0)}
          </span>
          <p className="font-label text-[0.7rem] tracking-[0.12em] text-bone/45 uppercase">
            © {year} {identity.fullName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {contact.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="link-draw font-label text-[0.7rem] tracking-[0.12em] text-bone/55 uppercase transition-colors duration-150 hover:text-bone"
            >
              {social.label}
            </a>
          ))}
          <a
            href="#top"
            className="link-draw font-label text-[0.7rem] tracking-[0.12em] text-bone/55 uppercase transition-colors duration-150 hover:text-bone"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
