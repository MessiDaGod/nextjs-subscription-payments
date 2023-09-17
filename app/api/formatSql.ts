import * as monaco from "monaco-editor";
import https from 'https';
import axios from 'axios';

export type OnChange = (
  value: string | undefined,
  ev: monaco.editor.IModelContentChangedEvent
) => void;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export async function formatSql(value: string) {
  const response = await axios.post(
    'https://localhost:5006/api/sql/GetFormattedSql',
    { value: `${value}` },
    {
      httpsAgent: agent,
      timeout: 50000,
    }
  );

  const formattedSql = await response.data.json();
  return formattedSql;
}

export const getFormatted = async (inputString: string): Promise<string> => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    const encoded = `https://localhost:5006/api/data/FormatSql?inputString=${encodeURIComponent(inputString)}`;

    const response = await axios.get(encoded, {httpsAgent: agent, timeout: 300000});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFormatSqlDecrypted = async (inputString: string): Promise<string> => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    const encoded = `https://localhost:5006/api/data/FormatSqlEncrypted?inputString=${encodeURIComponent(inputString)}`;

    const response = await axios.get(encoded, {httpsAgent: agent, timeout: 300000});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFormatSqlEncrypted = async (inputString: string): Promise<string> => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    const encoded = `https://localhost:5006/api/data/FormatSqlDecrypted?inputString=${encodeURIComponent(inputString)}`;

    const response = await axios.get(encoded, {httpsAgent: agent, timeout: 300000});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




