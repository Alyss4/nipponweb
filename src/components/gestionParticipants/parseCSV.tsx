import { Participant } from "./types";

export const parseCSV = (content: string): Participant[] => {
  const rows = content.split("\n");
  const headers = rows[0].split(",");
  return rows.slice(1).map((row) => {
    const values = row.split(",");
    const participant: any = {};
    headers.forEach((header, i) => {
      participant[header.trim()] = values[i]?.trim();
    });
    return participant as Participant;
  });
};
