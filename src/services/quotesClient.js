// Devuelve { ref, verifyUrl, shortCode, blobUrl } con el PDF YA firmado
export async function registerAndSignOnServer(pdfBlob, payload) {
    const fd = new FormData();
    fd.append('file', pdfBlob, `${payload.ref}.pdf`);
    fd.append('ref', payload.ref);
    if (payload.total != null) fd.append('total', String(payload.total));
    if (payload.email) fd.append('email', payload.email);

    const res = await fetch('/api/quotes/register-sign', { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`Error firmando: ${res.status} ${await res.text()}`);
    return res.json();
}
