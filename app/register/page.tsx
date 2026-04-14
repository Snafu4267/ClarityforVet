import { redirect } from "next/navigation";

/** Registration lives on the full welcome page (trial copy, sign-in, invite). */
export default function RegisterRedirectPage() {
  redirect("/welcome#create-account");
}
