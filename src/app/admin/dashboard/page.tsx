//import { User } from "@clerk/nextjs/dist/api";
import { redirect } from "next/navigation";
import { checkRole } from "../../../../utils/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./_actions";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: { id: string; emailAddress: string }[];
  primaryEmailAddressId: string | null;
  publicMetadata: { role?: string };
};

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  let users: User[] = [];
  if (query) {
    users = await clerkClient.users.getUserList({ query });
  }

  return (
    <>
      <h1>This is the admin dashboard</h1>
      <p>This page is restricted to users with the 'admin' role.</p>
      <p></p>

      <SearchUsers />

      {users.map((user) => {
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress;

        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>{primaryEmail}</div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button type="submit">Make Moderator</button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
}
