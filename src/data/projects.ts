import type { Project } from '../types/data';

export const projects: Project[] = [
  {
    id: 'lna-design',
    title: 'Low-Noise Amplifier for 5G NR',
    brief: 'Sub-2 dB noise figure LNA targeting the n77 band at 3.5 GHz.',
    summary:
      'Designed a two-stage cascode LNA in 65 nm CMOS targeting 5G New Radio n77 band (3.3–4.2 GHz). Achieved a simulated noise figure of 1.8 dB with 18 dB gain using inductive source degeneration and optimized input matching. Layout was completed in Cadence Virtuoso with post-layout extraction confirming performance within 0.3 dB of schematic simulation.',
    thumbnail: '/projects/lna-design.png',
    images: ['/projects/lna-design.svg', '/projects/lna-schematic.svg'],
    domain: 'RF',
    techStack: ['Cadence Virtuoso', 'Spectre RF', 'ADS', '65nm CMOS', 'S-parameter analysis'],
    links: [
      {
        label: 'Report',
        url: '#',
      },
    ],
    featured: true,
  },
  {
    id: 'mems-accelerometer',
    title: 'MEMS Capacitive Accelerometer',
    brief: 'Surface-micromachined accelerometer with sub-mG resolution.',
    summary:
      'Fabricated a capacitive MEMS accelerometer using a 4-mask surface micromachining process on SOI wafers. The comb-drive structure achieves differential capacitance sensing with 0.5 mG resolution at 100 Hz bandwidth. Process included DRIE etching, oxide sacrificial release, and critical-point drying to prevent stiction.',
    thumbnail: '/projects/mems-accelerometer.svg',
    images: ['/projects/mems-accelerometer.svg', '/projects/mems-sem.svg'],
    domain: 'Fabrication',
    techStack: ['L-Edit', 'COMSOL', 'DRIE', 'SOI wafers', 'SEM characterization'],
    links: [
      {
        label: 'Process Report',
        url: '#',
      },
    ],
    featured: false,
  },
  {
    id: 'fpga-signal-processor',
    title: 'FPGA Real-Time Signal Processor',
    brief: 'Pipelined FFT engine on Xilinx Artix-7 for spectrum analysis.',
    summary:
      'Implemented a 1024-point pipelined radix-2 FFT processor on a Xilinx Artix-7 FPGA, operating at 200 MHz clock rate. The design processes I/Q samples from a 12-bit ADC and outputs magnitude-squared spectrum data over AXI-Stream. Resource utilization was optimized using block RAM for twiddle factors and DSP48 slices for butterfly multiply-accumulate operations.',
    thumbnail: '/projects/fpga-processor.svg',
    images: ['/projects/fpga-processor.svg', '/projects/fpga-block-diagram.svg'],
    domain: 'Digital',
    techStack: ['Vivado', 'SystemVerilog', 'Artix-7', 'AXI-Stream', 'ModelSim'],
    links: [
      {
        label: 'GitHub',
        url: '#',
      },
    ],
    featured: false,
  },
  {
    id: 'precision-adc-frontend',
    title: 'Precision ADC Front-End',
    brief: '24-bit delta-sigma ADC analog front-end for strain gauge bridges.',
    summary:
      'Designed a low-noise analog front-end for a 24-bit delta-sigma ADC (ADS1256) interfacing with Wheatstone bridge strain gauges. The circuit includes a chopper-stabilized instrumentation amplifier with 120 dB CMRR, programmable gain from 1 to 128, and a 4th-order anti-aliasing filter. Achieved 20-bit effective resolution at 30 SPS with less than 1 uV RMS input-referred noise.',
    thumbnail: '/projects/adc-frontend.svg',
    images: ['/projects/adc-frontend.svg', '/projects/adc-pcb.svg'],
    domain: 'Analog',
    techStack: ['Altium Designer', 'LTspice', 'ADS1256', 'PCB layout', 'Noise analysis'],
    links: [
      {
        label: 'Schematic',
        url: '#',
      },
    ],
    featured: true,
  },
];
