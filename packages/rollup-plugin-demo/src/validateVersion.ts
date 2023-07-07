export const validateVersion = (
  actualVersion: string,
  peerDependencyVersion: string,
  name: string
) => {
  const versionRegexp = /\^(\d+\.\d+\.\d+)/g
  let minMajor = Infinity
  let minMinor = Infinity
  let minPatch = Infinity
  let foundVersion: RegExpExecArray | null
  while ((foundVersion = versionRegexp.exec(peerDependencyVersion))) {
    const [foundMajor, foundMinor, foundPatch] = foundVersion[1]
      .split('.')
      .map(Number)
    if (foundMajor < minMajor) {
      minMajor = foundMajor
      minMinor = foundMinor
      minPatch = foundPatch
    }
  }
  if (!actualVersion) {
    throw new Error(
      `Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch}.`
    )
  }
  const [major, minor, patch] = actualVersion.split('.').map(Number)
  if (
    major < minMajor ||
    (major === minMajor &&
      (minor < minMinor || (minor === minMinor && patch < minPatch)))
  ) {
    throw new Error(
      `Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch} but found ${name}@${actualVersion}.`
    )
  }
}

export default validateVersion
