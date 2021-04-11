import * as moment from 'moment';
import { prettyPrint } from 'utils/pretty-print';

describe('pretty print', () => {
  it('should print numbers', () => {
    expect(prettyPrint(1.5)).toBe('1.5');
  });

  it('should handle strings', () => {
    expect(prettyPrint('abc')).toBe('"abc"');
  });

  it('should handle undefined', () => {
    expect(prettyPrint(undefined)).toBe('undefined');
  });

  it('should handle moment dates', () => {
    expect(prettyPrint(moment('19-Jan-2000', 'DD-MMM-YYYY'))).toBe(
      '19-01-2000',
    );
  });

  describe('pretty print object', () => {
    it('should print object with no props', () => {
      expect(prettyPrint({})).toBe('{\n}');
    });

    it('should handle object with primitive properties', () => {
      expect(prettyPrint({ prop1: 1, prop2: 'abc' })).toBe(
        '{\n\tprop1: 1\n\tprop2: "abc"\n}',
      );
    });

    it('should handle object with nested object properties', () => {
      expect(prettyPrint({ p: { prop1: 1, prop2: 'abc' } })).toBe(
        '{\n\tp: {\n\t\tprop1: 1\n\t\tprop2: "abc"\n\t}\n}',
      );
    });
  });
});
