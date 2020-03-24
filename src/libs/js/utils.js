var string_utils = { };


string_utils.tiny = (text, max = 50) => {
    if (typeof (text) !== 'string')
        return '';
    else
        return text.length > max ? (text.substring (0, max) + '...') : text;
}

module.exports = {
    STRING: string_utils
}