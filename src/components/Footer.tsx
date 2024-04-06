import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-3xl font-bold my-8">News</h1>
      <div className="max-w-4xl w-full">
        <article className="mb-8">
          <h2 className="text-xl font-extralight mb-1">
            Presentation of the 2023 full-year results for JM-Qafri
          </h2>
          <div className="flex items-center justify-between mb-4">
            <time className="text-sm" dateTime="2024-02-01">
              01.02.2024
            </time>
            <div className="flex gap-2">
              <Link className="text-sm" href="#">
                EN
              </Link>
              <Link className="text-sm" href="#">
                DE
              </Link>
            </div>
          </div>
          <hr />
        </article>
        <article className="mb-8">
          <h2 className="text-xl font-extralight mb-1">
            More news on JM-Qafri telemedicine
          </h2>
          <div className="flex items-center justify-between mb-4">
            <time className="text-sm" dateTime="2023-12-07">
              07.12.2023
            </time>
            <div className="flex gap-2">
              <Link className="text-sm" href="#">
                EN
              </Link>
              <Link className="text-sm" href="#">
                DE
              </Link>
            </div>
          </div>
          <hr />
        </article>
        <article className="mb-8">
          <h2 className="text-xl font-extralight mb-1">
            Update on Africa pharmaceuticals
          </h2>
          <div className="flex items-center justify-between mb-4">
            <time className="text-sm" dateTime="2023-11-27">
              27.11.2023
            </time>
            <div className="flex gap-2">
              <Link className="text-sm" href="#">
                EN
              </Link>
              <Link className="text-sm" href="#">
                DE
              </Link>
            </div>
          </div>
          <hr />
        </article>
        <div className="text-center mt-8 mb-16">
          <Button variant="ghost">See All</Button>
        </div>
        <footer className="border-t pt-4 pb-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex gap-4">
              <Link className="text-sm" href="#">
                About Us
              </Link>
              <Link className="text-sm" href="#">
                Contact
              </Link>
              <Link className="text-sm" href="#">
                Legal
              </Link>
            </div>
            <div className="flex gap-4">
              <Link className="text-sm" href="#">
                Data Privacy Policy for Electronic Services
              </Link>
              <Link className="text-sm" href="#">
                Terms of Use
              </Link>
            </div>
          </div>
          <p className="text-sm text-center mt-4">
            Certain products and services of JM-Qafri are not accessible to
            residents and/or nationals of certain countries. Website users are
            therefore asked to consult the Terms of use applicable to this
            website and to contact their nearest JM-Qafri entity (“Locations”)
            for information on products and services available in their country.
            Furthermore, users may consult their legal/tax advisors should they
            require any clarifications on the interpretation of the Terms of
            use.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <FacebookIcon className="h-6 w-6" />
            <MessageCircleIcon className="h-6 w-6" />
            <YoutubeIcon className="h-6 w-6" />
            <LinkedinIcon className="h-6 w-6" />
            <InstagramIcon className="h-6 w-6" />
          </div>
          <p className="text-sm text-center mt-4">©2024 JM-Qafri</p>
        </footer>
      </div>
    </div>
  );
}

function FacebookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

function YoutubeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
