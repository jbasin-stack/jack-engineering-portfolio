import { useState } from 'react';
import { motion } from 'motion/react';
import { papers } from '../../data/papers';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';
import { PaperRow } from './PaperRow';
import { PdfViewer } from '../pdf/PdfViewer';

export function PapersSection() {
  const [viewingPdf, setViewingPdf] = useState<{
    file: string;
    title: string;
  } | null>(null);

  return (
    <motion.section
      id="papers"
      aria-label="Papers"
      className="px-6 py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-2xl font-bold text-ink"
          variants={fadeUpVariant}
        >
          Papers
        </motion.h2>

        {/* Paper rows with dividers */}
        <motion.div
          className="mt-12 divide-y divide-silicon-200/30"
          variants={fadeUpVariant}
        >
          {papers.map((paper) => (
            <PaperRow
              key={paper.id}
              paper={paper}
              onView={() =>
                setViewingPdf({ file: paper.pdfPath, title: paper.title })
              }
            />
          ))}
        </motion.div>
      </div>

      {/* Shared PDF viewer opens when a paper is selected */}
      <PdfViewer
        file={viewingPdf?.file ?? ''}
        title={viewingPdf?.title ?? ''}
        open={viewingPdf !== null}
        onOpenChange={(open) => {
          if (!open) setViewingPdf(null);
        }}
      />
    </motion.section>
  );
}
