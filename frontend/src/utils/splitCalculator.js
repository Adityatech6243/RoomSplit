/**
 * Calculates equal share amounts across participants ensuring exact penny sum equality.
 * Avoids JS floating-point issues by calculating in cents/paise.
 */
export const calculateEqualSplits = (totalAmount, participants) => {
  if (!participants || participants.length === 0 || !totalAmount) {
    return [];
  }

  const count = participants.length;
  const totalCents = Math.round(Number(totalAmount) * 100);
  const baseShareCents = Math.floor(totalCents / count);
  let remainder = totalCents - (baseShareCents * count);

  return participants.map((p) => {
    // Distribute remainder 1 cent at a time to the first participants
    const shareCents = baseShareCents + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    return {
      userId: p.id || p.userId,
      userName: p.name || p.userName,
      shareAmount: Number((shareCents / 100).toFixed(2))
    };
  });
};

/**
 * Validates whether custom split amounts sum exactly to total expense amount.
 */
export const validateCustomSplits = (totalAmount, splits) => {
  const target = Math.round(Number(totalAmount) * 100);
  const currentTotal = splits.reduce((sum, s) => {
    return sum + Math.round(Number(s.shareAmount || 0) * 100);
  }, 0);

  const diff = target - currentTotal;
  return {
    isValid: diff === 0 && target > 0,
    currentTotal: Number((currentTotal / 100).toFixed(2)),
    difference: Number((diff / 100).toFixed(2)),
    isOver: diff < 0,
    isUnder: diff > 0
  };
};
