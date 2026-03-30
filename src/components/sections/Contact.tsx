import { motion } from 'motion/react';
import { Mail, Github, Linkedin, FileText } from 'lucide-react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';
import { contactData } from '../../data/contact';

// Icon lookup for data-driven link rendering
const iconMap = { Mail, Github, Linkedin, FileText } as const;

export function Contact() {
  // Unified links array: email, socials, and resume in one horizontal row
  const links = [
    { label: 'Email', href: `mailto:${contactData.email}`, icon: 'Mail' as const, external: false },
    { label: 'GitHub', href: contactData.socialLinks[0].url, icon: 'Github' as const, external: true },
    { label: 'LinkedIn', href: contactData.socialLinks[1].url, icon: 'Linkedin' as const, external: true },
    { label: 'Resume', href: contactData.resumePath, icon: 'FileText' as const, download: true },
  ];

  return (
    <div className="px-6 py-24">
      <motion.section
        id="contact"
        aria-label="Contact Information"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Section heading */}
          <motion.h2
            className="text-2xl font-bold text-ink"
            variants={fadeUpVariant}
          >
            Say Hello
          </motion.h2>

          {/* Tagline */}
          <motion.p
            className="mt-4 text-lg text-silicon-600"
            variants={fadeUpVariant}
          >
            {contactData.tagline}
          </motion.p>

          {/* 4 equal links in a horizontal row */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
            variants={fadeUpVariant}
          >
            {links.map((link) => {
              const Icon = iconMap[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  {...('download' in link && link.download ? { download: true } : {})}
                  className="inline-flex items-center gap-2 text-silicon-400 transition-colors duration-300 hover:text-accent"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {link.label}
                </a>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
