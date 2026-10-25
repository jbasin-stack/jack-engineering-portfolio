import type { ToolingGroup } from '../types/data';

export const toolingGroups: ToolingGroup[] = [
  {
    category: 'EDA Tools',
    items: [
      'Cadence Virtuoso / Spectre',
      'Ansys HFSS',
      'Altium Designer',
      'LTspice',
      'ModelSim',
    ],
  },
  {
    category: 'Lab Equipment',
    items: [
      'Vector Network Analyzer',
      'Oscilloscope (PyVISA / SCPI)',
      'Probe Station',
      'Bench Power Supply',
    ],
  },
  {
    category: 'Fabrication Processes',
    items: [
      'Heidelberg MLA150 Maskless Lithography',
      'Contact Lithography',
      'PECVD',
      'ICP / RIE Etch',
      'Metal Evaporation & Lift-off',
      'Profilometry, Ellipsometry & 4-Point Probe',
    ],
  },
];
