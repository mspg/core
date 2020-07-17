const addTrailingSlash = str => (str.endsWith('/') ? str : `${str}/`)

export default addTrailingSlash
