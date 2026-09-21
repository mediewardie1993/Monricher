// Web3Forms turns a plain POST into an email to whatever address verified
// this key — no backend of our own needed, which matters since this site
// ships as a static export on some deployments (GitHub Pages, the portable
// USB build, Hostinger) with no server to call. The access key is meant to
// be embedded in client-side code (Web3Forms' own docs put it directly in
// form HTML) — it's rate-limited and submission-scoped on their end, not a
// secret that needs hiding.
//
// TODO: replace once a real key exists (from https://web3forms.com — Create
// your Form, verify the destination email, copy the key it gives you).
export const WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_REAL_WEB3FORMS_ACCESS_KEY";

export type InquiryFields = Record<string, string>;

/**
 * Sends an inquiry (contact form or completed chatbot lead) to Web3Forms,
 * which emails it to Monricher. Returns whether it actually went through —
 * callers should tell the user plainly if it didn't, rather than pretending
 * success, since there's no other record of the inquiry anywhere.
 */
export async function sendInquiry(subject: string, fields: InquiryFields): Promise<boolean> {
  if (WEB3FORMS_ACCESS_KEY.startsWith("REPLACE_WITH")) {
    console.warn("Web3Forms access key not configured yet — inquiry not sent:", subject, fields);
    return false;
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: "Monricher Website",
        ...fields
      })
    });
    const result = await response.json();
    return Boolean(result.success);
  } catch {
    return false;
  }
}
