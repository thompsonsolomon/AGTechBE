const REGISTRATION_FEES = {
  farmer: 3000,

  "cooperative-new": 25000,

  "cooperative-old": 25000,

  partner: 200000,

  investor: 500000,

  sponsor: 500000,
};

const getRegistrationFee = (type) => {
  return REGISTRATION_FEES[type] || null;
};

module.exports = {
  REGISTRATION_FEES,
  getRegistrationFee,
};