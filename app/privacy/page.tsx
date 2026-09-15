import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { companyInfo } from "@/lib/site-data";

const LAST_UPDATED = "September 2026";

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="section-space">
        <div className="container-shell max-w-3xl">
          <SectionHeading
            kicker="Privacy Policy"
            title="How Monricher Construction & Development Corp handles your information."
            text={`Last updated: ${LAST_UPDATED}`}
            align="left"
          />

          <div className="mt-10 grid gap-8 text-[0.97rem] leading-7 text-slate-200/92">
            <div>
              <h2 className="text-lg font-bold text-white">What we collect</h2>
              <p className="mt-3">
                When you reach out through our Contact form or chat with our website assistant, we collect the
                information you choose to share, which may include your name, phone number, email address,
                project location, project type, budget range, timeline, and a description of the work you need.
                We do not ask for or collect payment information, government IDs, or other sensitive personal
                information through this website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Why we collect it</h2>
              <p className="mt-3">
                We use this information solely to respond to your inquiry, prepare a project quote or estimate,
                and follow up with you about your project. We do not sell, rent, or share your information with
                third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">How it's stored</h2>
              <p className="mt-3">
                Our website assistant keeps a copy of your conversation in your own browser's local storage so
                the chat continues where you left off if you return — this stays on your device and is not
                automatically visible to us. When you complete an inquiry (through the chat assistant or the
                Contact form), the details you provide are sent to our team so we can follow up with you.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Your rights</h2>
              <p className="mt-3">
                Under the Data Privacy Act of 2012 (Republic Act No. 10173), you have the right to be informed,
                to access, to correct, and to request deletion of your personal information. To exercise any of
                these rights, or if you have questions about how your information is handled, contact us using
                the details below.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Cookies and local storage</h2>
              <p className="mt-3">
                This site does not use tracking or advertising cookies. The website assistant uses your
                browser's local storage only to remember your conversation; you can clear it at any time using
                the "Clear chat" option in the assistant, or by clearing your browser's site data.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Contact us</h2>
              <p className="mt-3">
                Phone: {companyInfo.phone}
                <br />
                Email: {companyInfo.email}
                <br />
                Address: {companyInfo.address}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
