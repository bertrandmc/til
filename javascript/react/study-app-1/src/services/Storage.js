
function localStorageSave(key, value) {
  if(typeof value === 'object') {
    value = JSON.stringify(value);
  }

  localStorage.setItem(key, value);
}

const localStorageGet = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch(e) {
    return value;
  }
}

export default {
  saveItem: localStorageSave,
  getItem: localStorageGet,
}
