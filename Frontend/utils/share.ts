export async function copyText(text: string, successMessage?: string) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (successMessage) alert(successMessage);
  } catch (e) {
    // ignore
  }
}

export async function sharePostLink(postId: string) {
  const url = `${location.origin}/post/${postId}`;
  await copyText(url);
}

export async function copyProfileLink(userId: string) {
  const url = `${location.origin}/profile/${userId}`;
  await copyText(url);
}

export default { copyText, sharePostLink, copyProfileLink };
