import { redirect } from "next/navigation";

export default function RootPage() {
  // During this frontend phase, root redirects to login
  redirect("/login");
}
