import { randomUUID } from "node:crypto";

// Stockage en mémoire : les demandes disparaissent au redémarrage du serveur.
export const createContactRepository = ({
  generateId = randomUUID,
  now = () => new Date(),
} = {}) => {
  const messages = [];

  const save = (contact) => {
    const saved = {
      ...contact,
      id: generateId(),
      receivedAt: now().toISOString(),
    };
    messages.push(saved);
    return saved;
  };

  const findAll = () => [...messages];

  return { save, findAll };
};
