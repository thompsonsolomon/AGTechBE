const { db } = require("../config/firebase");

const createPendingRegistration = async (data) => {
  const ref = db.collection("registrations").doc();

  const registration = {
    id: ref.id,
    ...data,
    status: "pending_payment",
    paymentStatus: "unpaid",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await ref.set(registration);

  return registration;
};

const updateRegistration = async (id, data) => {
  const ref = db.collection("registrations").doc(id);

  await ref.update({
    ...data,
    updatedAt: new Date(),
  });

  const updated = await ref.get();

  return updated.data();
};

const getRegistration = async (id) => {
  const doc = await db.collection("registrations").doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
};

const getRegistrations = async (type = null) => {
  let query = db.collection("registrations");

  if (type) {
    query = query.where("type", "==", type);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();

  return snapshot.docs.map((doc) => doc.data());
};

module.exports = {
  createPendingRegistration,
  updateRegistration,
  getRegistration,
  getRegistrations,
};