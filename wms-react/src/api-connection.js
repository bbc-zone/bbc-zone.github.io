const CONFIG_FILE_NAME = 'api-config.json';

let apiConfigPromise;

function cleanBaseUrl(url) {
  return String(url || '').trim().replace(/\/$/, '');
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getConfigCandidates() {
  const currentConfig = new URL(CONFIG_FILE_NAME, window.location.href).href;

  if (import.meta.env.DEV) {
    return uniqueValues([new URL(CONFIG_FILE_NAME, window.location.origin).href, currentConfig]);
  }

  return [currentConfig];
}

function cleanServerText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function notifyApiError(error) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('wms-api-error', {
      detail: {
        message: error.message || 'API request failed',
      },
    })
  );
}

export async function getApiConfig() {
  if (!apiConfigPromise) {
    apiConfigPromise = (async () => {
      const errors = [];

      for (const configUrl of getConfigCandidates()) {
        try {
          const response = await fetch(`${configUrl}?v=${Date.now()}`, { cache: 'no-store' });

          if (!response.ok) {
            errors.push(`${configUrl}: HTTP ${response.status}`);
            continue;
          }

          const config = await response.json();
          const apiBaseUrl = cleanBaseUrl(config.apiBaseUrl);

          if (!apiBaseUrl) {
            throw new Error(`${configUrl}: apiBaseUrl is empty`);
          }

          return { apiBaseUrl };
        } catch (error) {
          errors.push(`${configUrl}: ${error.message || 'Failed to read API config'}`);
        }
      }

      throw new Error(`API config could not be loaded. ${errors.join(' | ')}`);
    })();
  }

  return apiConfigPromise;
}

export async function apiUrl(path = '') {
  const config = await getApiConfig();
  const cleanPath = String(path).replace(/^\//, '');

  return cleanPath ? new URL(cleanPath, `${config.apiBaseUrl}/`).href : config.apiBaseUrl;
}

export async function apiRequest(path = '', options = {}) {
  try {
    const response = await fetch(await apiUrl(path), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const rawText = await response.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      const serverText = cleanServerText(rawText);
      throw new Error(
        serverText
          ? `API response is not JSON: ${serverText}`
          : `API response is not JSON: HTTP ${response.status}`
      );
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    notifyApiError(error);
    throw error;
  }
}

export function getApiConnectionStatus() {
  return apiRequest('index.php?resource=connection-test');
}

export function getItemMasterList() {
  return apiRequest('index.php?resource=item-master');
}

export function createItemMaster(payload) {
  return apiRequest('index.php?resource=item-master', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateItemMaster(payload) {
  return apiRequest('index.php?resource=item-master', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteItemMaster(id) {
  return apiRequest(`index.php?resource=item-master&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getFinalStepList() {
  return apiRequest('index.php?resource=final-step');
}

export function createFinalStep(payload) {
  return apiRequest('index.php?resource=final-step', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateFinalStep(payload) {
  return apiRequest('index.php?resource=final-step', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteFinalStep(planId) {
  return apiRequest(`index.php?resource=final-step&plan_id=${encodeURIComponent(planId)}`, {
    method: 'DELETE',
  });
}

export function getProductionActual(planId) {
  if (!planId || Number(planId) <= 0) {
    return Promise.reject(new Error('Plan ID is required'));
  }

  return apiRequest(`index.php?resource=production-actual&plan_id=${encodeURIComponent(planId)}`);
}

export function createProductionActual(payload) {
  if (!payload?.plan_id || Number(payload.plan_id) <= 0) {
    return Promise.reject(new Error('Plan ID is required'));
  }

  return apiRequest('index.php?resource=production-actual', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateProductionActual(payload) {
  return apiRequest('index.php?resource=production-actual', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProductionActual(actualId) {
  return apiRequest(`index.php?resource=production-actual&actual_id=${encodeURIComponent(actualId)}`, {
    method: 'DELETE',
  });
}
