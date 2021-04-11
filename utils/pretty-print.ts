import { isMoment } from 'moment';

export const prettyPrint = (obj: any, indent = ''): string => {
  if (typeof obj === 'undefined') {
    return 'undefined';
  } else if (isMoment(obj)) {
    return obj.format('DD-MM-YYYY');
  } else if (typeof obj === 'object') {
    const prettyObj = Object.keys(obj).reduce(
      (result, key) =>
        [
          result,
          indent,
          '\t',
          `${key}: `,
          prettyPrint(obj[key], `${indent}\t`),
          '\n',
        ].join(''),
      '',
    );
    return `{\n${prettyObj}${indent}}`;
  } else if (typeof obj === 'string') {
    return `"${obj}"`;
  }
  return obj.toString();
};
