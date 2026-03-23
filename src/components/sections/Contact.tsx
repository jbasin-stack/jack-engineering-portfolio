import { motion } from 'motion/react';
import { Mail, Download, Github, Linkedin } from 'lucide-react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';
import { contactData } from '../../data/contact';

// Icon lookup for data-driven social link rendering
const iconMap = { Github, Linkedin } as const;

export function Contact() {
  return (
    <motion.section
      id="contact"
      className="px-6 py-24"
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
          Get in Touch
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-lg text-silicon-600"
          variants={fadeUpVariant}
        >
          {contactData.tagline}
        </motion.p>

        {/* Email -- semantic address element */}
        <motion.div className="mt-8" variants={fadeUpVariant}>
          <address className="not-italic">
            <a
              href={`mailto:${contactData.email}`}
              className="inline-flex items-center gap-2 text-ink transition-colors duration-300 hover:text-accent"
            >
              <Mail size={18} strokeWidth={1.5} />
              {contactData.email}
            </a>
          </address>
        </motion.div>

        {/* Resume download -- THE only filled accent button on the entire page */}
        <motion.div className="mt-8" variants={fadeUpVariant}>
          <a
            href={contactData.resumePath}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Download size={18} strokeWidth={1.5} />
            Download Resume
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          variants={fadeUpVariant}
        >
          {contactData.socialLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-silicon-400 transition-colors duration-300 hover:text-ink"
              >
                <Icon size={20} strokeWidth={1.5} />
              </a>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
