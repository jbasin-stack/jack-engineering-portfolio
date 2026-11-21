import type { Project } from '../types/data';

export const projects: Project[] = [
  {
    id: 'anc-interference-cancellation',
    title: 'Real-Time Adaptive Audio Interference Cancellation',
    brief:
      'Closed-loop system that hunts down an interference tone and retunes an analog notch filter onto it.',
    summary:
      'UW ECE Departmental Honors project (advised by Prof. H. Naghavi). A laptop plays music contaminated by a single interference tone; a Tektronix TDS2004B captures the waveform and computes its FFT; a Python detector windows the spectrum, finds the peak within 2-20 kHz, and requires it to persist across five consecutive frames before acting. The confirmed frequency is sent over serial to an Arduino Nano, which inverts f₀ = 1/(2πRC) to solve for the tap code D and drives an MCP4251 dual digital potentiometer over SPI. Those two wipers are the integrator resistors of a Tow–Thomas biquad built from four OP484 op-amps on ±5 V rails, so the notch center slides onto the interferer while the 10 kΩ feedback resistor and 10 nF capacitors hold bandwidth fixed at 1.59 kHz. Measured attenuation was −10 to −30 dB with Q ranging from 1.26 at 2 kHz to 12.6 at 20 kHz. Because the digipot only offers 256 taps, the notch sometimes lands up to ~1 kHz off target — a quantization limit the accompanying interactive explainer reproduces rather than hides.',
    thumbnail: '/projects/anc-interference-cancellation.jpg',
    images: [
      '/projects/anc-interference-cancellation-spectrum.jpg',
      '/projects/anc-interference-cancellation-diagram.jpg',
      '/projects/anc-interference-cancellation-schematic.jpg',
    ],
    domain: 'Mixed-Signal',
    techStack: [
      'Tow–Thomas biquad',
      'OP484',
      'MCP4251 digipot',
      'Arduino Nano',
      'Python FFT',
      'Tektronix TDS2004B',
    ],
    links: [
      {
        label: 'Interactive Explainer',
        url: 'https://anc-visual.vercel.app',
      },
      {
        label: 'Paper (PDF)',
        url: '/papers/active-notch-filter.pdf',
      },
    ],
    featured: true,
  },
  {
    id: 'schottky-diode-fabrication',
    title: 'Schottky Diode Fabrication',
    brief: 'Semiconductor device fabrication from wafer to characterization',
    summary:
      'Fabricated Schottky diodes on 100 mm silicon wafers at the Washington Nanofabrication Facility through a full DELM (Deposition, Etch, Lithography, Metrology) flow: PECVD oxide, contact photolithography, ICP oxide etch, and Al/Cr evaporation with lift-off. Patterned features from 5 to 100 µm, tracked sheet resistance, oxide thickness, and etch depth at each step, and characterized the finished devices with I-V and capacitance measurements on a probe station.',
    thumbnail: '/projects/schottky-diode-fabrication.jpg',
    images: [
      '/projects/schottky-diode-fabrication-diodeproject-processflow-1-page-0001.jpg',
      '/projects/schottky-diode-fabrication-diodeproject-processflow-1-page-0002.jpg',
    ],
    domain: 'Semiconductor Fabrication',
    techStack: [
      'Photolithography',
      'Thin-film Deposition',
      '4-Point Probe',
      'Profilometry',
      'PECVD',
      'ICP Etch',
    ],
    links: [],
    featured: false,
  },
  {
    id: 'semiconductor-field-guide',
    title: 'Semiconductor Field Guide',
    brief:
      'A curated guide to learning the chip industry, with an animated walkthrough of how a chip is made.',
    summary:
      'A multi-page guide to the YouTube channels, Substack newsletters, podcasts, and books I actually use to follow the semiconductor industry, built from my own subscriptions. Each section filters by tags (study, history, fabrication, chip design…). A Chip basics page breaks the value chain into step-by-step stages that link to those resources, with a glossary whose terms open in place. "Journey of a chip" is a nine-stage scroll-driven walkthrough (specs, RTL, circuit, layout, masks, fab, wafer test, packaging, shipping) where one object morphs from a layout into masks, a wafer, a die, and a packaged chip, all animated with CSS 3D driven by scroll progress. Plain HTML, CSS, and ES modules with no framework or build step, deployed on Vercel.',
    thumbnail: '/projects/semiconductor-field-guide.jpg',
    images: ['/projects/semiconductor-field-guide-journey.jpg', '/projects/semiconductor-field-guide-basics.jpg'],
    domain: 'Web Development',
    techStack: ['HTML / CSS / ES modules', 'CSS 3D transforms', 'Scroll-driven animation', 'Node test runner', 'Vercel'],
    links: [
      {
        label: 'Visit the Field Guide',
        url: 'https://semiconductor-field-guide.vercel.app',
      },
      {
        label: 'Journey of a Chip',
        url: 'https://semiconductor-field-guide.vercel.app/journey.html',
      },
    ],
    featured: false,
  },
];
