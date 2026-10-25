import type { TimelineMilestone } from '../types/data';

export const milestones: TimelineMilestone[] = [
  {
    date: 'Sep 2023',
    title: 'Started ECE at UW',
    description:
      'Began a BS in Electrical & Computer Engineering at the University of Washington as a College Honors student',
  },
  {
    date: 'May 2025',
    title: 'Washington Nanofabrication Facility',
    description:
      'Joined as an Undergraduate Research Assistant, running cleanroom processes for 150+ academic and commercial users and characterizing photoresist spin curves',
  },
  {
    date: 'Jun 2025',
    title: 'Pipelined CPU',
    description:
      'Built a 5-stage pipelined LEGv8 CPU in SystemVerilog; forwarding logic improved CPI by 70% for a 2.7× speedup over the non-pipelined design',
  },
  {
    date: 'Jan 2026',
    title: '4×1 Patch Antenna Array',
    description:
      'Designed, fabricated, and measured a 5.8 GHz array on FR-4 with 9.18 dBi gain; a stacked parasitic patch doubled measured bandwidth to 1.3 GHz',
  },
  {
    date: 'Mar 2026',
    title: 'Departmental Honors Project',
    description:
      'Built a closed-loop adaptive notch filter that detects an interference tone by FFT and retunes itself onto it over SPI',
  },
  {
    date: 'May 2026',
    title: 'CMOS 5T OTA',
    description:
      'Designed and optimized a 5T OTA in Cadence Virtuoso (gpdk045), reaching 22.2 dB gain and 1.40 GHz GBW',
  },
  {
    date: 'Jun 2026',
    title: 'Micron Technology Internship',
    description:
      'Photolithography process engineering intern on the Boise DRAM line; consolidated a two-coat SOG/SOC flow into a single MLR process, cutting 400 hr/week of cycle time',
  },
  {
    date: 'Sep 2026',
    title: 'Lead Undergraduate Research Assistant, WNF',
    description:
      'Leading a team of 14 undergraduate RAs, training new cleanroom users, and characterizing grayscale lithography on the Heidelberg MLA150',
  },
  {
    date: 'Oct 2026',
    title: 'Joined the EMiT Lab',
    description:
      'Research with Prof. Sajjad Moazeni on AI-assisted analog IC design, driving Cadence through a custom MCP server',
  },
];
