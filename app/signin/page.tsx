import { SignInContent } from "components/account/signin-content";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const returnTo =
    typeof params.return_to === "string" ? params.return_to : null;

  return <SignInContent error={error} returnTo={returnTo} />;
}
