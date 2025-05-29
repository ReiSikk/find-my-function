import { Preview } from "@react-email/preview";
import { EmailTemplate } from "../components/email-template";
/* //TODO: REMOVE FOR PRODUCTION!!! */

export default function EmailPreviewPage() {
  return (
    <EmailTemplate email="sikkrei@gmail.com" />
  );
}