const URL = (window as any).websiteUrl;
const API_PATH = `${URL}settings-api/`;

/** Post JSON to path in the settings api */
export async function post(path: string, body: any) {
  await fetch(`${API_PATH}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

/** Fetches JSON object from path in the settings api */
export async function getJson(path: string) {
  const res = await fetch(`${API_PATH}${path}`);
  const json = await res.json();
  return json;
}

/** Get the settings object */
export async function getSettings() {
  return await getJson('get');
}