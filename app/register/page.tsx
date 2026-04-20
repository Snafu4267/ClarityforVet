import { redirect } from "next/navigation";

/** Registration actions start on the welcome page. */
export default function RegisterRedirectPage() {
  redirect("/welcome");
}
