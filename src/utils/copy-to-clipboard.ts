export default async function copyTextToClipboard(textToCopy: string) {
  try {
    await navigator.clipboard.writeText(textToCopy)

    return {
      status: 'success'
    } as const
  } catch (error) {
    console.error(error)

    return {
      status: 'error'
    } as const
  }
}
