import type { ToolingGroup } from '../types/data';

export const toolingGroups: ToolingGroup[] = [
  {
    category: 'EDA Tools',
    items: [
      'Cadence Virtuoso',
      'Keysight ADS',
      'KiCad',
      'LTspice',
      'Xilinx Vivado',
    ],
  },
  {
    category: 'Lab Equipment',
    items: [
      'Oscilloscope',
      'Spectrum Analyzer',
      'Network Analyzer',
      'Signal Generator',
      'Power Supply',
    ],
  },
  {
    category: 'Fabrication Processes',
    items: [
      'Thermal Evaporation',
      'Plasma Etching',
      'Spin Coating',
      'Wire Bonding',
    ],
  },
];
