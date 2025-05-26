
import { MileageRates } from '../types/charge';

export const MILEAGE_RATES: MileageRates = {
  '3': {
    upTo5000: 0.529,
    from5001To20000: { rate: 0.316, fixed: 1065 },
    above20000: 0.370
  },
  '4': {
    upTo5000: 0.606,
    from5001To20000: { rate: 0.340, fixed: 1330 },
    above20000: 0.407
  },
  '5': {
    upTo5000: 0.636,
    from5001To20000: { rate: 0.357, fixed: 1395 },
    above20000: 0.427
  },
  '6': {
    upTo5000: 0.665,
    from5001To20000: { rate: 0.374, fixed: 1457 },
    above20000: 0.447
  },
  '7': {
    upTo5000: 0.697,
    from5001To20000: { rate: 0.394, fixed: 1515 },
    above20000: 0.470
  }
};

export const calculateMileageAmount = (
  distance: number,
  powerCV: number,
  totalAnnualDistance: number
): number => {
  console.log('Calculating mileage with:', { distance, powerCV, totalAnnualDistance });
  
  if (!distance || !powerCV || !totalAnnualDistance || distance <= 0 || totalAnnualDistance <= 0) {
    console.log('Invalid inputs for mileage calculation');
    return 0;
  }

  const powerKey = powerCV <= 3 ? '3' : 
                   powerCV === 4 ? '4' : 
                   powerCV === 5 ? '5' : 
                   powerCV === 6 ? '6' : '7';

  const rates = MILEAGE_RATES[powerKey];
  let result = 0;

  try {
    if (totalAnnualDistance <= 5000) {
      result = distance * rates.upTo5000;
    } else if (totalAnnualDistance <= 20000) {
      // Pour les distances entre 5001 et 20000 km
      if (distance <= 5000) {
        result = distance * rates.upTo5000;
      } else {
        const portion1 = 5000 * rates.upTo5000;
        const portion2 = (distance - 5000) * rates.from5001To20000.rate;
        result = portion1 + portion2;
      }
    } else {
      // Pour les distances supérieures à 20000 km
      result = distance * rates.above20000;
    }
    
    console.log('Mileage calculation result:', result);
    return Math.round(result * 100) / 100; // Arrondir à 2 décimales
  } catch (error) {
    console.error('Error in mileage calculation:', error);
    return 0;
  }
};
