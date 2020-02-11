var storage     = { },
    storage_ref = typeof (localStorage) !== 'undefined' ? localStorage : null;


storage.get = (key) => {
    var hit = null
    if (storage_ref && key)
        hit = storage_ref.getItem (key);

    if (hit && hit !== '' && hit.startsWith ('{'))
        hit = JSON.parse (hit);

    return hit;
}

storage.set = (key, value) => {
    // console.log ('storage set', key, value)
    if (storage_ref && key && value) {
        if (typeof (value) === 'object')
            value = JSON.stringify (value);

        storage_ref.setItem (key, value);
    }
}

storage.remove = (key) => {
    if (storage_ref && key) {
        storage_ref.removeItem (key);
    }
}

module.exports = storage;