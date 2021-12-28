const amount = (rawData, startDate, endDate) => {
  const withDate = rawData.map((x) => {
    return { date: new Date(x.date), amount: x.amount };
  });

  const filtered = withDate.filter(
    (x) => x.date >= startDate && x.date <= endDate
  );

  if (filtered.length === 0) return 0;

  const min = filtered.reduce((p, v) => {
    return p.date < v.date ? p : v;
  });

  const max = filtered.reduce((p, v) => {
    return p.date > v.date ? p : v;
  });

  return max.amount - min.amount;
};

module.exports = amount;
