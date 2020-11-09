/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { H2, Text } from "./Text";
import Button from "./Button";
import Stack from "./Stack";
import CleverButton from "auth/CleverAuthButton";
import { OPDS1 } from "interfaces";
import useLibraryContext from "./context/LibraryContext";
import { BasicAuthMethod, CleverAuthMethod } from "types/opds1";
import BasicAuthButton from "auth/BasicAuthButton";
import useUser from "./context/UserContext";
import SignOut from "./SignOut";
import useAuthModalContext from "auth/AuthModalContext";
import { basicAuthMethod } from "test-utils/fixtures";
import { flexDirection } from "styled-system";
import Link from "next/link";

type PopularBook = { alt: string; imgHref: string };

const popularBooks = {
  EarlyGrades: [
    { alt: "book cover text 1", imgHref: "/img/earlygrades-1.jpg" },
    { alt: "book cover text 1", imgHref: "/img/earlygrades-2.jpg" },
    { alt: "book cover text 1", imgHref: "/img/earlygrades-3.jpg" }
  ],
  MiddleGrades: [
    { alt: "book cover text 1", imgHref: "/img/middlegrades-1.jpg" },
    { alt: "book cover text 1", imgHref: "/img/middlegrades-2.jpg" },
    { alt: "book cover text 1", imgHref: "/img/middlegrades-3.jpg" }
  ],
  HighSchool: [
    { alt: "book cover text 1", imgHref: "/img/highschool-1.jpg" },
    { alt: "book cover text 1", imgHref: "/img/highschool-2.jpg" },
    { alt: "book cover text 1", imgHref: "/img/highschool-3.jpg" }
  ]
};

const OpenEbooksLandingComponent = () => {
  const { authMethods } = useLibraryContext();
  const cleverMethod: CleverAuthMethod = authMethods.find(
    method => method.type === OPDS1.CleverAuthType
  ) as CleverAuthMethod;
  const basicMethod: BasicAuthMethod = authMethods.find(
    method => method.type === OPDS1.BasicAuthType
  ) as BasicAuthMethod;
  const { showModal } = useAuthModalContext();

  return (
    <>
      <div
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <OpenEbooksHero />
        <div
          sx={{
            flex: "2",
            maxWidth: 1100,
            mx: "auto",
            my: 4,
            textAlign: "center"
          }}
        >
          <H2>Lorem Ipsum Secondary Headline Welcome Openebooks</H2>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
        </div>
        <div
          id="loginRegion"
          sx={{
            backgroundColor: "ui.gray.extraLight"
          }}
        >
          <div
            sx={{
              maxWidth: 1100,
              mx: "auto",
              display: "flex"
            }}
          >
            <Stack
              direction="column"
              sx={{
                mx: [3, 5],
                my: 4,
                flexWrap: ["wrap", "nowrap"]
              }}
            >
              <div>
                <img alt="Clever Logo" src={"/img/CleverLogo.png"} />
              </div>
              <Text>
                Clever is the platform that powers technology in the classroom.
                Today, one in three innovative K-12 schools in the U.S. trust
                Clever to secure their student data as they adopt learning apps
                in the classroom.
              </Text>
              <div>
                <CleverButton method={cleverMethod} />
              </div>
            </Stack>
            <Stack
              direction="column"
              sx={{
                mx: [3, 5],
                my: 4,
                flexWrap: ["wrap", "nowrap"]
              }}
            >
              <div>
                <img alt="FirstBook Logo" src={"/img/FirstBookLogo.png"} />
              </div>
              <Text>
                First Book is a nonprofit organization that provides access to
                high quality, brand new books and educational resources - for
                free and at low cost - to schools and programs serving children
                in need.
              </Text>
              <div>
                <Button
                  onClick={() => showModal({ selectedMethod: basicMethod })}
                >
                  Sign In
                </Button>
              </div>
            </Stack>
          </div>
        </div>
        <div
          sx={{
            backgroundColor: "brand.primary"
          }}
        >
          <div
            sx={{
              maxWidth: 1100,
              mx: "auto",
              display: "flex",
              flexWrap: ["wrap", "nowrap"]
            }}
          >
            <div
              sx={{
                flex: "1"
              }}
            >
              <img
                alt="Mobile Device with Open Ebooks"
                src={"/img/SimplyEIpad.png"}
              />
            </div>
            <Stack
              direction="column"
              sx={{
                flex: "2",
                my: 4,
                color: "ui.white"
              }}
            >
              <H2>Open e-Books Mobile Shoutout Here</H2>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </Stack>
          </div>
        </div>
        <div sx={{ maxWidth: 1100, mx: "auto" }}>
          <PopularBookSection books={popularBooks.HighSchool} />
          <PopularBookSection
            books={popularBooks.MiddleGrades}
            coverLocation="right"
          />
          <PopularBookSection books={popularBooks.EarlyGrades} />
        </div>
        <div sx={{ backgroundColor: "brand.primary" }}>
          <div
            sx={{
              maxWidth: 1100,
              mx: "auto",
              textAlign: "center",
              color: "ui.white"
            }}
          >
            <Stack direction="column" sx={{ mx: [3, 5], my: 4 }}>
              <H2>FAQ</H2>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.{" "}
              </Text>
              <div>
                <Button variant="filled" color="ui.white">
                  <span sx={{ color: "ui.black" }}> Learn More</span>
                </Button>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
};

const OpenEbooksHero: React.FC = () => {
  const { isAuthenticated, isLoading } = useUser();
  const { showModalAndReset } = useAuthModalContext();

  return (
    <div
      sx={{
        backgroundImage: `url('/img/HeroImage.jpg')`,
        minHeight: "350px",

        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div sx={{ display: "flex", justifyContent: "flex-end" }}>
          {isAuthenticated ? (
            <SignOut />
          ) : (
            <Button onClick={showModalAndReset} loading={isLoading}>
              Sign In
            </Button>
          )}
        </div>
        <div
          sx={{
            margin: "auto",
            maxWidth: "1100"
          }}
        >
          <img
            sx={{
              mx: "auto"
            }}
            alt="Open Ebooks Logo"
            src="/img/OpenEbooksLogo.png"
          />
        </div>
        <div sx={{ marginBottom: "auto" }}>
          <Link href="#loginRegion">blah</Link>
        </div>
      </div>
    </div>
  );
};

const PopularBookSection: React.FC<{
  books: PopularBook[];
  coverLocation?: "left" | "right";
}> = ({ books, coverLocation }) => {
  return (
    <div
      sx={{
        display: "flex",
        my: 4,
        flexWrap: ["wrap", "wrap", "nowrap"],
        flexDirection: coverLocation === "right" ? "row-reverse" : "row"
      }}
    >
      <div sx={{ display: "flex", flex: "2", mx: [3, 4], my: 4 }}>
        {books.map(book => {
          return (
            <div
              key={book.imgHref}
              sx={{ flex: "1", mx: 1, maxHeight: "400px" }}
            >
              <img
                sx={{ maxWidth: "100%", minWidth: "180px" }}
                alt={book.alt}
                src={book.imgHref}
              />
            </div>
          );
        })}
      </div>
      <Stack direction="column" sx={{ flex: "1", mx: [3, 5], my: 4 }}>
        <H2>Popular Early Grades Books</H2>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </Stack>
    </div>
  );
};

export default OpenEbooksLandingComponent;
