import { pluck, getCurrentBreakpoint } from './responsive';

describe('responsive helper functions', () => {
  describe('pluck', () => {
    it('should pluck field from collection', () => {
      const someCollection = [
        {
          field: 'dummy',
        },
        {
          field: 'dummy1',
        },
      ];

      expect(pluck('field')(someCollection)).to.deep.equal(['dummy', 'dummy1']);
    });
  });

  describe('getCurrentBreakpoint', () => {
    const breakpoints = [768, 1024, 340];
    it('should give 768 on given 341', () => {
      expect(getCurrentBreakpoint(341)(breakpoints)).to.equal(768);
    });

    it('should give 340 on given exact 340', () => {
      expect(getCurrentBreakpoint(340)(breakpoints)).to.equal(340);
    });

    it('should give the smallest breakpoint (340) on given 0', () => {
      expect(getCurrentBreakpoint(0)(breakpoints)).to.equal(340);
    });
  });
});
