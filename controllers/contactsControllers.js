import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateFavoriteSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    console.log("req.body: ", req.body);
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const result = await contactsService.addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res) => {
  if (JSON.stringify(req.body) === "{}") {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const updatedContact = await contactsService.updateContact(id, req.body);

  if (!updatedContact) {
    throw HttpError(404);
  }

  res.json(updatedContact);
};

export const updateContactFavorite = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { id } = req.params;
    const { favorite } = req.body;

    const updatedContact = await contactsService.updateStatusContact(id, {
      favorite,
    });

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
