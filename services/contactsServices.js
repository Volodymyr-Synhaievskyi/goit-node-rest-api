import Contact from "../db/models/Contact.js";

export const listContacts = async () => {
  return await Contact.findAll();
};

export const getContactById = async (id) => {
  return await Contact.findByPk(id);
};

export const addContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const removeContact = async (id) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const updateContact = async (id, updateData) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  return await contact.update(updateData);
};

export const updateStatusContact = async (id, updateData) => {
  return await updateContact(id, updateData);
};
