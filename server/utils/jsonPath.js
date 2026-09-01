const jsonPathForKey = (key) => {
  const escapedKey = String(key).replaceAll('\\', '\\\\').replaceAll('"', '\\"')
  return `$."${escapedKey}"`
}

module.exports = jsonPathForKey
