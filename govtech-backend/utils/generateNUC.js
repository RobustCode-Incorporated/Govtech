function generateNUC(birthDate, provinceCode = 'KIN') {
  const date = new Date(birthDate);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires

  return `${provinceCode}${year}${month}${day}${random}`;
}

module.exports = generateNUC;