import type { Course } from '../types/data';

export const courses: Course[] = [
  {
    code: 'EE 215',
    name: 'Fundamentals of Electrical Engineering',
    descriptor: 'Circuit analysis and linear systems fundamentals',
  },
  {
    code: 'EE 233',
    name: 'Circuit Theory',
    descriptor: 'AC/DC circuit analysis with phasors and Laplace transforms',
  },
  {
    code: 'EE 271',
    name: 'Digital Circuits and Systems',
    descriptor: 'Boolean logic, combinational and sequential circuits',
  },
  {
    code: 'EE 331',
    name: 'Devices and Circuits I',
    descriptor: 'Semiconductor physics and MOSFET device modeling',
  },
  {
    code: 'EE 332',
    name: 'Devices and Circuits II',
    descriptor: 'Amplifier design and frequency response analysis',
  },
  {
    code: 'EE 341',
    name: 'Electromagnetic Theory',
    descriptor: 'Maxwell\'s equations and transmission line theory',
  },
  {
    code: 'EE 475',
    name: 'Introduction to VLSI',
    descriptor: 'CMOS circuit design and layout fundamentals',
  },
  {
    code: 'EE 478',
    name: 'Computer-Aided Design for VLSI',
    descriptor: 'Automated design flow and physical verification',
  },
];
