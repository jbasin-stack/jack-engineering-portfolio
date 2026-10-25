import type { SkillGroup } from '../types/data';

export const skillGroups: SkillGroup[] = [
  {
    domain: 'Fabrication',
    skills: [
      'Photolithography & Grayscale Lithography',
      'Photoresist Spin-Curve Characterization',
      'Thin-Film Deposition & Etch',
      'Process Metrology',
      'SPC & Process Characterization',
      'ISO 5 Cleanroom Operations',
    ],
  },
  {
    domain: 'RF',
    skills: [
      'Microstrip Antenna Design',
      'Impedance Matching & Feed Networks',
      'Full-Wave EM Simulation',
      'S-Parameter Measurement',
    ],
  },
  {
    domain: 'Analog',
    skills: [
      'CMOS Amplifier Design',
      'Active Filter Design',
      'Op-Amp Circuits',
      'SPICE Simulation',
      'PCB Layout',
    ],
  },
  {
    domain: 'Digital',
    skills: [
      'SystemVerilog',
      'Pipelined CPU Design',
      'FPGA Development',
      'Embedded C (Arduino)',
      'Python Instrument Control & FFT',
    ],
  },
];
