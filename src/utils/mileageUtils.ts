
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
  const powerKey = powerCV <= 3 ? '3' : 
                   powerCV === 4 ? '4' : 
                   powerCV === 5 ? '5' : 
                   powerCV === 6 ? '6' : '7';

  const rates = MILEAGE_RATES[powerKey];

  if (totalAnnualDistance <= 5000) {
    return distance * rates.upTo5000;
  } else if (totalAnnualDistance <= 20000) {
    const portion1 = Math.min(distance, 5000) * rates.upTo5000;
    const portion2 = Math.max(0, distance - 5000) * rates.from5001To20000.rate;
    return portion1 + portion2 + (rates.from5001To20000.fixed * (distance / totalAnnualDistance));
  } else {
    return distance * rates.above20000;
  }
};
