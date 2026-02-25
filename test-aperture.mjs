// Quick test script for translateAperture function
import { translateAperture } from './utils/visualTranslators.ts';

console.log('Testing translateAperture function:\n');

const testCases = [
  'f/1.2',
  'f/1.4',
  'f/2.0',
  'f/2.8',
  'f/4.0',
  'f/5.6',
  'f/8.0',
  'f/11',
  'f/16',
  'f/22',
  'f/32',
  'F/2.8', // Test case insensitivity
  'invalid', // Test error handling
];

testCases.forEach(aperture => {
  const result = translateAperture(aperture);
  console.log(`${aperture.padEnd(10)} => ${result}`);
});
