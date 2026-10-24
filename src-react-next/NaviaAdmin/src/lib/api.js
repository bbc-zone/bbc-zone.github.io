export function postApi(url, payload = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: createFormBody(payload),
  }).then((response) => response.json());
}

function createFormBody(payload) {
  const body = new URLSearchParams();

  appendFormValue(body, '', payload);

  return body;
}

function appendFormValue(body, key, value) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendFormValue(body, `${key}[${index}]`, item));
    return;
  }

  if (value !== null && typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendFormValue(body, key ? `${key}[${childKey}]` : childKey, childValue);
    });
    return;
  }

  if (key) {
    body.append(key, value ?? '');
  }
}
