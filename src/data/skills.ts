import type { SkillGroup } from '../types/data';

export const skillGroups: SkillGroup[] = [
  {
    domain: 'Fabrication',
    skills: [
      'Thin Film Deposition',
      'Wet/Dry Etching',
      'SEM/AFM Characterization',
      'Cleanroom Protocol',
      'Photolithography',
    ],
  },
  {
    domain: 'RF',
    skills: ['S-Parameter Analysis', 'Impedance Matching', 'Filter Design', 'VNA Operation'],
  },
  {
    domain: 'Analog',
    skills: ['Circuit Analysis', 'Op-Amp Design', 'PCB Layout', 'SPICE Simulation'],
  },
  {
    domain: 'Digital',
    skills: ['Verilog/VHDL', 'FPGA Design', 'Embedded C', 'Digital Signal Processing'],
  },
];
