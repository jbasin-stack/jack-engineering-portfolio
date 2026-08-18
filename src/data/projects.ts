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
      ' Fabricated Schottky diodes at the Washington Nanofabrication Facility using full DELM (Deposition, Etch, Lithography, Metrology) processes. Patterned features ranging from 5-100µm on 4-inch wafers and characterized device behavior through 4-terminal impedance measurements, film thickness verification, and IV performance analysis. Achieved ideality factors within 20% of theoretical predictions.',
    thumbnail: '/projects/schottky-diode-fabrication.jpg',
    images: [
      '/projects/schottky-diode-fabrication-diodeproject-processflow-1-page-0001.jpg',
      '/projects/schottky-diode-fabrication-diodeproject-processflow-1-page-0002.jpg',
    ],
    domain: 'Semiconductor Fabrication',
    techStack: [
      'Photolithography',
      'Thin-film Deposition',
      '4PP profilometry',
      'PECVD',
      'ICP Etch',
    ],
    links: [],
    featured: false,
  },
];
