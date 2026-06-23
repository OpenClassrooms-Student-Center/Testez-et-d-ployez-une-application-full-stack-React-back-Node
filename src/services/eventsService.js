import { readFile } from "node:fs/promises";

const DATA_FILE = new URL("../../data/events.json", import.meta.url);

export const createEventsService = ({ dataFile = DATA_FILE } = {}) => {
  const loadAll = async () => JSON.parse(await readFile(dataFile, "utf8"));

  const findById = async (id) => {
    const { events } = await loadAll();
    return events.find((event) => event.id === id) ?? null;
  };

  return { loadAll, findById };
};
